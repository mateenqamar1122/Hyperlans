
// Add the user_id field to the session creation
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPomodoroSession, PomodoroSession, getTasks, Task } from '@/services/productivityService';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type SessionType = 'work' | 'short-break' | 'long-break';

interface TimerProps {
  onSessionComplete: () => void;
}

const PomodoroTimer: React.FC<TimerProps> = ({ onSessionComplete }) => {
  // State
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default: 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Auth context
  const { user } = useAuth();
  
  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  
  // Session durations in seconds
  const durations = {
    work: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60
  };
  
  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskList = await getTasks();
        setTasks(taskList.filter(task => task.status !== 'completed'));
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    
    loadTasks();
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            completeSession();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      // Record start time
      if (!startTimeRef.current) {
        startTimeRef.current = new Date();
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);
  
  const startTimer = () => {
    setIsActive(true);
    startTimeRef.current = new Date();
  };
  
  const pauseTimer = () => {
    setIsActive(false);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[sessionType]);
    startTimeRef.current = null;
  };
  
  const changeSessionType = (type: SessionType) => {
    setSessionType(type);
    setTimeLeft(durations[type]);
    setIsActive(false);
    startTimeRef.current = null;
  };
  
  const completeSession = async () => {
    setIsActive(false);
    
    try {
      if (startTimeRef.current) {
        const endTime = new Date();
        const sessionDuration = Math.round((endTime.getTime() - startTimeRef.current.getTime()) / 1000);
        
        // Save the session record
        await createPomodoroSession({
          start_time: startTimeRef.current.toISOString(),
          end_time: endTime.toISOString(),
          duration: sessionDuration,
          session_type: sessionType,
          task_id: selectedTaskId,
          user_id: user?.id || '' // Add the user_id field
        });
        
        toast.success(`${sessionType.replace('-', ' ')} session completed!`);
        onSessionComplete();
        
        // For work sessions, suggest a break
        if (sessionType === 'work') {
          changeSessionType('short-break');
        } else {
          changeSessionType('work');
        }
      }
    } catch (error) {
      console.error('Failed to save session:', error);
      toast.error('Could not save your session');
    }
    
    startTimeRef.current = null;
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const total = durations[sessionType];
    return ((total - timeLeft) / total) * 100;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center mb-4 space-x-2">
            {(['work', 'short-break', 'long-break'] as SessionType[]).map((type) => (
              <Button
                key={type}
                variant={sessionType === type ? "default" : "outline"}
                onClick={() => changeSessionType(type)}
                className="capitalize"
              >
                {type.replace('-', ' ')}
              </Button>
            ))}
          </div>
          
          <div className="relative flex items-center justify-center">
            <svg className="w-full max-w-52 h-52" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="5"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={sessionType === 'work' ? "hsl(var(--primary))" : "hsl(var(--brand-magenta))"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - calculateProgress() / 100)}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute text-4xl font-bold">{formatTime(timeLeft)}</div>
          </div>
          
          <div className="pt-4">
            <label className="text-sm font-medium mb-1 block">Link to task (optional)</label>
            <Select
              value={selectedTaskId || ''}
              onValueChange={setSelectedTaskId}
              disabled={isActive}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No task</SelectItem>
                {tasks.map(task => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 pt-2">
        {!isActive ? (
          <Button onClick={startTimer} className="flex gap-2">
            <Play className="h-4 w-4" /> Start
          </Button>
        ) : (
          <Button onClick={pauseTimer} variant="outline" className="flex gap-2">
            <Pause className="h-4 w-4" /> Pause
          </Button>
        )}
        <Button onClick={resetTimer} variant="outline" className="flex gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button 
          onClick={completeSession} 
          variant="ghost"
          disabled={!startTimeRef.current}
          className="flex gap-2"
        >
          <CheckCircle2 className="h-4 w-4" /> Complete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;
