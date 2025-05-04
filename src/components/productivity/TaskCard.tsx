
import { useState } from "react";
import { format } from "date-fns";
import {
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Check,
  CopyCheck,
  Tag,
  Link2,
  Repeat,
  GripVertical
} from "lucide-react";
import { Task } from "@/services/productivityService";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, completed: boolean) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging,
  dragHandleProps
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleStatusChange = (checked: boolean) => {
    onStatusChange(task.id, checked);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "p-4 rounded-lg border mb-2 transition-all",
        isDragging ? "bg-accent shadow-md" : "bg-card",
        task.status === "completed" ? "border-dashed border-green-500 bg-green-50/30 dark:bg-green-950/10" : "border-border"
      )}
    >
      <div className="flex items-start justify-between space-x-2">
        <div className="flex items-start space-x-3 flex-1">
          <div 
            className="pt-0.5 cursor-grab active:cursor-grabbing touch-none"
            {...dragHandleProps}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={handleStatusChange}
            className="mt-1"
          />

          <div className="space-y-1 flex-1 min-w-0">
            <p className={`font-medium truncate ${
              task.status === "completed" ? "line-through text-muted-foreground" : ""
            }`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="outline" className={cn("inline-flex items-center text-xs", getPriorityColor())}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>

              {task.is_recurring && (
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 inline-flex items-center text-xs">
                  <Repeat className="h-3 w-3 mr-1" />
                  {task.recurring_pattern || "Recurring"}
                </Badge>
              )}

              {task.due_date && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 inline-flex items-center text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(task.due_date), "MMM d")}
                </Badge>
              )}
              
              {task.time_estimate && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 inline-flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.time_estimate}m
                </Badge>
              )}
              
              {task.tags && task.tags.length > 0 && (
                <Badge variant="outline" className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 inline-flex items-center text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {task.tags.length === 1 ? task.tags[0] : `${task.tags.length} tags`}
                </Badge>
              )}
              
              {task.related_tasks && task.related_tasks.length > 0 && (
                <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 inline-flex items-center text-xs">
                  <Link2 className="h-3 w-3 mr-1" />
                  {task.related_tasks.length} related
                </Badge>
              )}

              {task.labels && task.labels.map(label => (
                <Badge key={label} variant="default" className="inline-flex items-center text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className={cn("transition-opacity", isHovered ? "opacity-100" : "opacity-0")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onStatusChange(task.id, !task.status.includes("completed"))}>
                <Check className="h-4 w-4 mr-2" />
                Mark as {task.status === "completed" ? "Incomplete" : "Complete"}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
