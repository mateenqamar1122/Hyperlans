
import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "@/services/productivityService";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskListProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, completed: boolean) => void;
}

export default function TaskList({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskListProps) {
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const taskCount = tasks.length;

  return (
    <div className="h-full flex flex-col">
      <div 
        className="flex items-center justify-between p-3 border-b"
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            {taskCount}
          </span>
        </div>
        
        <div className={cn("transition-opacity", isHeaderHovered ? "opacity-100" : "opacity-0")}>
          {onAddTask && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onAddTask}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Task</span>
            </Button>
          )}
        </div>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-2 overflow-y-auto min-h-[10rem]",
              snapshot.isDraggingOver && "bg-accent/50"
            )}
          >
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-sm text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No tasks yet</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <TaskCard
                        task={task}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        onStatusChange={onStatusChange}
                        isDragging={snapshot.isDragging}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
