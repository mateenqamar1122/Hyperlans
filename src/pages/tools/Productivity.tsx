
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ListTodo, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Check,
  Clock,
  CalendarDays,
  Tag,
  AlertCircle,
  Calendar,
  Timer,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isBefore, isToday } from "date-fns";
import PomodoroTimer from "@/components/productivity/PomodoroTimer";
import TaskForm from "@/components/productivity/TaskForm";
import CalendarEventForm from "@/components/productivity/CalendarEventForm";
import GoalForm from "@/components/productivity/GoalForm";
import { getTasks, createTask, updateTask, deleteTask, getEvents, createEvent, updateEvent, deleteEvent, getGoals, createGoal, updateGoal, deleteGoal } from "@/services/productivityService";

const Productivity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [loading, setLoading] = useState({
    tasks: true,
    events: true,
    goals: true
  });

  // Load data from database
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      await Promise.all([
        loadTasks(),
        loadEvents(),
        loadGoals()
      ]);
    };
    
    loadData();
  }, [user]);

  const loadTasks = async () => {
    setLoading(prev => ({ ...prev, tasks: true }));
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  const loadEvents = async () => {
    setLoading(prev => ({ ...prev, events: true }));
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      toast({
        title: "Error",
        description: "Failed to load calendar events. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const loadGoals = async () => {
    setLoading(prev => ({ ...prev, goals: true }));
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error("Error loading goals:", error);
      toast({
        title: "Error",
        description: "Failed to load goals. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, goals: false }));
    }
  };

  // Task CRUD operations
  const handleAddTask = async (taskData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create tasks.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newTask = await createTask({
        ...taskData,
        due_date: taskData.due_date ? taskData.due_date.toISOString() : null,
      });
      
      if (newTask) {
        setTasks([...tasks, newTask]);
        setIsAddTaskOpen(false);
        toast({
          title: "Success",
          description: "Task created successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await updateTask(editingTask.id, {
        ...taskData,
        due_date: taskData.due_date ? taskData.due_date.toISOString() : null,
      });
      
      if (updatedTask) {
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
        setEditingTask(null);
        toast({
          title: "Success",
          description: "Task updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const success = await deleteTask(taskId);
      if (success) {
        setTasks(tasks.filter(task => task.id !== taskId));
        toast({
          title: "Success",
          description: "Task deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleTaskCompletion = async (task: any) => {
    try {
      const updatedTask = await updateTask(task.id, {
        status: task.status === 'completed' ? 'in-progress' : 'completed'
      });
      
      if (updatedTask) {
        setTasks(tasks.map(t => 
          t.id === updatedTask.id ? updatedTask : t
        ));
        toast({
          title: task.status === 'completed' ? "Task Reopened" : "Task Completed",
          description: updatedTask.title,
        });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Event CRUD operations
  const handleAddEvent = async (eventData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create events.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newEvent = await createEvent(eventData);
      
      if (newEvent) {
        setEvents([...events, newEvent]);
        setIsAddEventOpen(false);
        toast({
          title: "Success",
          description: "Event created successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!editingEvent) return;
    
    try {
      const updatedEvent = await updateEvent(editingEvent.id, eventData);
      
      if (updatedEvent) {
        setEvents(events.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        ));
        setEditingEvent(null);
        toast({
          title: "Success",
          description: "Event updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const success = await deleteEvent(eventId);
      if (success) {
        setEvents(events.filter(event => event.id !== eventId));
        toast({
          title: "Success",
          description: "Event deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Goal CRUD operations
  const handleAddGoal = async (goalData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create goals.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newGoal = await createGoal({
        ...goalData,
        deadline: goalData.deadline ? goalData.deadline.toISOString() : null,
      });
      
      if (newGoal) {
        setGoals([...goals, newGoal]);
        setIsAddGoalOpen(false);
        toast({
          title: "Success",
          description: "Goal created successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGoal = async (goalData: any) => {
    if (!editingGoal) return;
    
    try {
      const updatedGoal = await updateGoal(editingGoal.id, {
        ...goalData,
        deadline: goalData.deadline ? goalData.deadline.toISOString() : null,
      });
      
      if (updatedGoal) {
        setGoals(goals.map(goal => 
          goal.id === updatedGoal.id ? updatedGoal : goal
        ));
        setEditingGoal(null);
        toast({
          title: "Success",
          description: "Goal updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const success = await deleteGoal(goalId);
      if (success) {
        setGoals(goals.filter(goal => goal.id !== goalId));
        toast({
          title: "Success",
          description: "Goal deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "high": return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400";
      case "urgent": return "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];

    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.getDate() === selectedDate.getDate() &&
             eventDate.getMonth() === selectedDate.getMonth() &&
             eventDate.getFullYear() === selectedDate.getFullYear();
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Add a subtle background glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-cyan/5 via-primary/5 to-brand-blue/5 opacity-70 blur-[100px] pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent animate-fade-in-up">Productivity Corner</h1>
          <p className="text-muted-foreground animate-fade-in-up animation-delay-100">Manage your tasks, events, and goals all in one place.</p>
        </div>
        <Button 
          onClick={() => setIsAddTaskOpen(true)} 
          variant="gradient" 
          className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-200">
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 p-1 bg-background/80 backdrop-blur-sm border shadow-sm rounded-full w-fit">
          <TabsTrigger value="tasks" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/90 data-[state=active]:to-brand-cyan/90 data-[state=active]:text-white">
            <ListTodo className="mr-2 h-4 w-4" />
            Task Manager
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/90 data-[state=active]:to-brand-cyan/90 data-[state=active]:text-white">
            <Timer className="mr-2 h-4 w-4" />
            Pomodoro Timer
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/90 data-[state=active]:to-brand-cyan/90 data-[state=active]:text-white">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="goals" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/90 data-[state=active]:to-brand-cyan/90 data-[state=active]:text-white">
            <Tag className="mr-2 h-4 w-4" />
            Goal Tracker
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="border border-gray-300/30 dark:border-gray-700/30 shadow-lg bg-card/95 backdrop-blur-sm overflow-hidden relative rounded-xl">
            {/* Card inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-blue/5 pointer-events-none"></div>
            
            <CardHeader className="pb-3 relative z-10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">Today's Tasks</CardTitle>
                <Button size="sm" variant="gradient" className="shadow-sm" onClick={() => setIsAddTaskOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
              <CardDescription>Manage and track your daily tasks</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {loading.tasks ? (
                <div className="space-y-4">
                  {Array(3).fill(null).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-background/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded" />
                        <div>
                          <Skeleton className="h-5 w-40" />
                          <div className="flex items-center mt-1">
                            <Skeleton className="h-3 w-3 mr-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {tasks.length === 0 ? (
                    <div className="py-8 px-4 text-center text-muted-foreground text-sm border border-dashed rounded-xl bg-muted/30 backdrop-blur-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ListTodo className="h-10 w-10 text-muted-foreground opacity-50" />
                        <p>No tasks yet. Add a task to get started.</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddTaskOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Task
                        </Button>
                      </div>
                    </div>
                  ) : (
                    tasks
                      .sort((a, b) => {
                        // Sorting priority: completed last, then by due date, then priority
                        if (a.status === "completed" && b.status !== "completed") return 1;
                        if (a.status !== "completed" && b.status === "completed") return -1;
                        
                        // Sort by due date
                        const aDate = a.due_date ? new Date(a.due_date).getTime() : Infinity;
                        const bDate = b.due_date ? new Date(b.due_date).getTime() : Infinity;
                        if (aDate !== bDate) return aDate - bDate;
                        
                        // Sort by priority
                        const priorityValue = { urgent: 0, high: 1, medium: 2, low: 3 };
                        return (
                          priorityValue[a.priority as keyof typeof priorityValue] - 
                          priorityValue[b.priority as keyof typeof priorityValue]
                        );
                      })
                      .map((task) => (
                        <motion.div
                          key={task.id}
                          variants={itemVariants}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            task.status === "completed"
                              ? "border-dashed border-green-500 bg-green-50/30 dark:bg-green-950/10"
                              : task.due_date && isBefore(new Date(task.due_date), new Date()) && task.status !== "completed"
                              ? "border-red-200 bg-red-50/30 dark:bg-red-950/10"
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              checked={task.status === "completed"}
                              onCheckedChange={() => handleToggleTaskCompletion(task)}
                              className={`mt-1 ${
                                task.priority === "high" || task.priority === "urgent"
                                  ? "text-red-500 border-red-500"
                                  : task.priority === "medium"
                                  ? "text-amber-500 border-amber-500"
                                  : "text-blue-500 border-blue-500"
                              }`}
                            />
                            <div className="space-y-1">
                              <p className={`font-medium ${
                                task.status === "completed" ? "line-through text-muted-foreground" : ""
                              }`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                                {task.due_date && (
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      isBefore(new Date(task.due_date), new Date()) && task.status !== "completed"
                                        ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                        : isToday(new Date(task.due_date))
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                                        : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                                    }
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    {format(new Date(task.due_date), "MMM d")}
                                    {isBefore(new Date(task.due_date), new Date()) && task.status !== "completed" && (
                                      <span className="ml-1">(Overdue)</span>
                                    )}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingTask(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </motion.div>
                      ))
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
          
          {/* Add Task Dialog */}
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task with details and due date.
                </DialogDescription>
              </DialogHeader>
              <TaskForm 
                onSubmit={handleAddTask}
                onCancel={() => setIsAddTaskOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* Edit Task Dialog */}
          <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  Update task details and settings.
                </DialogDescription>
              </DialogHeader>
              {editingTask && (
                <TaskForm 
                  initialData={editingTask}
                  onSubmit={handleUpdateTask}
                  onCancel={() => setEditingTask(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="pomodoro" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
                <CardHeader>
                  <CardTitle>Pomodoro Timer</CardTitle>
                  <CardDescription>Focus with timed work sessions and breaks</CardDescription>
                </CardHeader>
                <CardContent>
                  <PomodoroTimer onSessionComplete={function (): void {
                    throw new Error("Function not implemented.");
                  } } />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
                <CardHeader>
                  <CardTitle>Focus Tips</CardTitle>
                  <CardDescription>How to make the most of your focus time</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900">
                      <h3 className="font-medium mb-1">The Pomodoro Technique</h3>
                      <p className="text-sm text-muted-foreground">
                        Work for 25 minutes, then take a 5-minute break. After 4 work sessions, take a longer 15-30 minute break.
                      </p>
                    </div>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Set clear objectives for each work session</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Eliminate distractions before starting a session</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Use the breaks to stretch, move, or rest your eyes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Track your progress and celebrate small wins</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Find your optimal work environment and routine</span>
                      </li>
                    </ul>
                  </motion.div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
                <CardHeader>
                  <CardTitle>Focus Analytics</CardTitle>
                  <CardDescription>Your focus time statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Today's Focus Time</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        2.5 hours
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Weekly Goal</span>
                        <span className="font-medium">12.5 / 20 hours</span>
                      </div>
                      <Progress value={63} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="border rounded-md p-2">
                        <div className="text-xs text-muted-foreground">Best Focus Day</div>
                        <div className="text-sm font-medium">Tuesday</div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="text-xs text-muted-foreground">Completed Sessions</div>
                        <div className="text-sm font-medium">18 this week</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Schedule & Calendar</CardTitle>
                <Button size="sm" onClick={() => setIsAddEventOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
              <CardDescription>View and manage your appointments and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="rounded-lg border shadow-sm p-4">
                    <CalendarComponent
                      className="rounded-md border"
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      modifiers={{
                        event: events.map(event => new Date(event.start_time)),
                      }}
                      modifiersStyles={{
                        event: { 
                          fontWeight: '600', 
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderBottom: '2px solid rgba(59, 130, 246, 0.8)',
                          color: '#4b5563'
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="md:w-1/2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </h3>
                    <Button size="sm" variant="outline" onClick={() => setIsAddEventOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                  
                  {loading.events ? (
                    <div className="space-y-3">
                      {Array(3).fill(null).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : getEventsForSelectedDate().length > 0 ? (
                    <motion.div 
                      className="space-y-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {getEventsForSelectedDate().map((event) => (
                        <motion.div 
                          key={event.id} 
                          className="flex border-l-2 border-blue-500 pl-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-r p-2"
                          variants={itemVariants}
                        >
                          <div className="w-32 text-sm text-muted-foreground">
                            {format(new Date(event.start_time), "h:mm a")} - 
                            {format(new Date(event.end_time), " h:mm a")}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center justify-between">
                              {event.title}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Event
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Event
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {event.location && (
                              <div className="text-sm text-muted-foreground">{event.location}</div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md">
                      <CalendarDays className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No events for this day</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setIsAddEventOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Add Event Dialog */}
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new calendar event.
                </DialogDescription>
              </DialogHeader>
              <CalendarEventForm 
                initialData={{ eventDate: selectedDate }}
                onSubmit={handleAddEvent}
                onCancel={() => setIsAddEventOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* Edit Event Dialog */}
          <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogDescription>
                  Update event details.
                </DialogDescription>
              </DialogHeader>
              {editingEvent && (
                <CalendarEventForm 
                  initialData={editingEvent}
                  onSubmit={handleUpdateEvent}
                  onCancel={() => setEditingEvent(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Goal Tracker</CardTitle>
                  <CardDescription>Set and track your personal and professional goals</CardDescription>
                </div>
                <Button onClick={() => setIsAddGoalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading.goals ? (
                  Array(3).fill(null).map((_, i) => (
                    <Card key={i} className="border border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-10" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                          
                          <div className="pt-2 space-y-2 text-sm">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : goals.length > 0 ? (
                  <AnimatePresence>
                    {goals.map((goal) => (
                      <motion.div 
                        key={goal.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors h-full">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{goal.title}</CardTitle>
                              <Badge variant="outline">{goal.type}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span className="font-medium">{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                              
                              <div className="pt-2 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Target:</span>
                                  <span>{goal.target}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Current:</span>
                                  <span>{goal.current}</span>
                                </div>
                                {goal.deadline && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Deadline:</span>
                                    <span className={
                                      isBefore(new Date(goal.deadline), new Date())
                                        ? "text-red-500"
                                        : ""
                                    }>
                                      {format(new Date(goal.deadline), "MMM d, yyyy")}
                                      {isBefore(new Date(goal.deadline), new Date()) && (
                                        <AlertCircle className="inline ml-1 h-3 w-3" />
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="pt-2 flex justify-between">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => setEditingGoal(goal)}
                                >
                                  <Edit className="mr-2 h-3.5 w-3.5" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Tag className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No goals found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Get started by adding your first goal.
                    </p>
                    <Button onClick={() => setIsAddGoalOpen(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Goal
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Add Goal Dialog */}
          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>
                  Create a new goal to track.
                </DialogDescription>
              </DialogHeader>
              <GoalForm 
                onSubmit={handleAddGoal}
                onCancel={() => setIsAddGoalOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* Edit Goal Dialog */}
          <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Goal</DialogTitle>
                <DialogDescription>
                  Update goal details and progress.
                </DialogDescription>
              </DialogHeader>
              {editingGoal && (
                <GoalForm 
                  initialData={editingGoal}
                  onSubmit={handleUpdateGoal}
                  onCancel={() => setEditingGoal(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Productivity;
