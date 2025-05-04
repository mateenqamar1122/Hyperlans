
import { useState, useEffect, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { 
  ListTodo, 
  MoreHorizontal ,
  Plus, 
  Search, 
  Check,
  Clock,
  CalendarDays,
  ListFilter,
  LayoutGrid,
  List,
  PlusCircle,
  Columns,
  Trash2,
  Edit
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { 
  getTasksGroupedByStatus, 
  updateTaskStatus,
  updateTask,
  createTask,
  deleteTask,
  Task,
  getTaskById
} from "@/services/productivityService";
import TaskList from "@/components/productivity/TaskList";
import TaskForm from "@/components/productivity/TaskForm";
import { Skeleton } from "@/components/ui/skeleton";
import TaskFilter, { FilterOption } from "@/components/productivity/TaskFilter";

// Custom column interface
interface CustomColumn {
  id: string;
  title: string;
  tasks: Task[];
}

const TaskManager = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskListId, setNewTaskListId] = useState("not-started");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumn, setEditingColumn] = useState<CustomColumn | null>(null);
  
  // Filter states
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
  const queryClient = useQueryClient();
  
  // Fetch tasks data
  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasksGroupedByStatus
  });

  // Load custom columns from localStorage on component mount
  useEffect(() => {
    const savedColumns = localStorage.getItem('taskCustomColumns');
    if (savedColumns) {
      setCustomColumns(JSON.parse(savedColumns));
    }
  }, []);
  
  // Save custom columns to localStorage whenever they change
  useEffect(() => {
    if (customColumns.length > 0) {
      localStorage.setItem('taskCustomColumns', JSON.stringify(customColumns));
    }
  }, [customColumns]);
  
  // Compute available filter options from tasks
  const allTags = useMemo(() => {
    if (!tasksData) return [];
    
    const tagsSet = new Set<string>();
    
    Object.values(tasksData).forEach(taskList => {
      taskList.forEach(task => {
        if (task.tags && task.tags.length) {
          task.tags.forEach(tag => tagsSet.add(tag));
        }
      });
    });
    
    return Array.from(tagsSet);
  }, [tasksData]);
  
  const allLabels = useMemo(() => {
    if (!tasksData) return [];
    
    const labelsSet = new Set<string>();
    
    Object.values(tasksData).forEach(taskList => {
      taskList.forEach(task => {
        if (task.labels && task.labels.length) {
          task.labels.forEach(label => labelsSet.add(label));
        }
      });
    });
    
    return Array.from(labelsSet);
  }, [tasksData]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((type: string, values: string[]) => {
    switch (type) {
      case "priority":
        setSelectedPriorities(values);
        break;
      case "project":
        setSelectedProjects(values);
        break;
      case "tag":
        setSelectedTags(values);
        break;
      case "label":
        setSelectedLabels(values);
        break;
      default:
        break;
    }
  }, []);
  
  // Filter tasks based on search query and selected filters
  const filteredTasks = useMemo(() => {
    if (!tasksData) return { 
      "not-started": [],
      "in-progress": [],
      "completed": []
    };
    
    const filtered = {} as Record<string, Task[]>;
    
    Object.entries(tasksData).forEach(([status, tasks]) => {
      filtered[status] = tasks.filter(task => {
        // Search filter
        const matchesSearch = searchQuery === "" || 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Priority filter
        const matchesPriority = selectedPriorities.length === 0 || 
          selectedPriorities.includes(task.priority);
        
        // Project filter
        const matchesProject = selectedProjects.length === 0 || 
          (task.project_id && selectedProjects.includes(task.project_id));
        
        // Tags filter
        const matchesTags = selectedTags.length === 0 || 
          (task.tags && task.tags.some(tag => selectedTags.includes(tag)));
        
        // Labels filter
        const matchesLabels = selectedLabels.length === 0 || 
          (task.labels && task.labels.some(label => selectedLabels.includes(label)));
        
        return matchesSearch && matchesPriority && matchesProject && matchesTags && matchesLabels;
      });
    });
    
    return filtered;
  }, [tasksData, searchQuery, selectedPriorities, selectedProjects, selectedTags, selectedLabels]);
  
  // Task CRUD mutations
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string, task: Partial<Task> }) => 
      updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
  
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string, completed: boolean }) => 
      updateTaskStatus(id, completed ? "completed" : "not-started"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
  
  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => 
      createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsAddTaskOpen(false);
    }
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
  
  // Drag and drop handler
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside a droppable area or in the same position
    if (!destination || 
       (destination.droppableId === source.droppableId && 
        destination.index === source.index)) {
      return;
    }
    
    // Check if the source or destination is a custom column
    const isSourceCustom = !['not-started', 'in-progress', 'completed'].includes(source.droppableId);
    const isDestCustom = !['not-started', 'in-progress', 'completed'].includes(destination.droppableId);
    
    // Handle drag between standard columns
    if (!isSourceCustom && !isDestCustom) {
      // Update the task status
      try {
        await updateTaskMutation.mutateAsync({
          id: draggableId,
          task: { status: destination.droppableId as any }
        });
        toast.success('Task moved successfully');
      } catch (error) {
        console.error("Failed to update task status:", error);
        toast.error("Failed to update task status");
      }
      return;
    }
    
    // Handle drag involving custom columns
    if (isSourceCustom) {
      // Find the task in the custom column
      let taskToMove: Task | undefined;
      const updatedColumns = customColumns.map(column => {
        if (column.id === source.droppableId) {
          const [task] = column.tasks.splice(source.index, 1);
          taskToMove = task;
          return column;
        }
        return column;
      });
      
      if (!taskToMove) return;
      
      // Update the task in the database if moving to a standard column
      if (!isDestCustom) {
        try {
          await updateTaskMutation.mutateAsync({
            id: taskToMove.id,
            task: { status: destination.droppableId as any }
          });
          toast.success('Task moved to system column');
        } catch (error) {
          console.error("Failed to update task status:", error);
          toast.error("Failed to move task");
        }
      } else {
        // Moving to another custom column
        const finalColumns = updatedColumns.map(column => {
          if (column.id === destination.droppableId) {
            column.tasks.splice(destination.index, 0, taskToMove!);
          }
          return column;
        });
        setCustomColumns(finalColumns);
        toast.success('Task moved between custom columns');
      }
    } else if (isDestCustom) {
      // Moving from standard column to custom column
      // Find the task in the standard columns
      const taskId = draggableId;
      let taskToMove: Task | undefined;
      
      if (tasksData) {
        Object.values(tasksData).forEach(tasks => {
          const task = tasks.find(t => t.id === taskId);
          if (task) taskToMove = task;
        });
      }
      
      if (!taskToMove) return;
      
      // Add the task to the custom column
      const updatedColumns = customColumns.map(column => {
        if (column.id === destination.droppableId) {
          column.tasks.splice(destination.index, 0, taskToMove!);
        }
        return column;
      });
      setCustomColumns(updatedColumns);
      
      // Update task in database to mark it as moved (optional)
      try {
        await updateTaskMutation.mutateAsync({
          id: taskToMove.id,
          task: { status: 'custom' as any }
        });
        toast.success('Task moved to custom column');
      } catch (error) {
        console.error("Failed to update task status:", error);
        toast.error("Failed to update task status");
      }
    }
  };
  
  // Column management functions
  const addCustomColumn = () => {
    if (newColumnTitle.trim() === '') {
      toast.error('Column title cannot be empty');
      return;
    }
    
    const newColumn: CustomColumn = {
      id: `custom-${Date.now()}`,
      title: newColumnTitle,
      tasks: []
    };
    
    setCustomColumns([...customColumns, newColumn]);
    setIsAddColumnOpen(false);
    setNewColumnTitle('');
    toast.success('New column added');
  };
  
  const updateCustomColumn = () => {
    if (!editingColumn) return;
    if (editingColumn.title.trim() === '') {
      toast.error('Column title cannot be empty');
      return;
    }
    
    const updatedColumns = customColumns.map(column => 
      column.id === editingColumn.id ? editingColumn : column
    );
    
    setCustomColumns(updatedColumns);
    setEditingColumn(null);
    toast.success('Column updated');
  };
  
  const deleteCustomColumn = (columnId: string) => {
    setCustomColumns(customColumns.filter(column => column.id !== columnId));
    toast.success('Column deleted');
  };
  
  // Event handlers
  const handleAddTask = (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    const newTask = {
      ...task,
      status: newTaskListId
    };
    
    createTaskMutation.mutate(newTask);
  };
  
  const handleEditTask = (task: any) => {
    if (!editingTask) return;
    
    updateTaskMutation.mutate({
      id: editingTask.id,
      task
    });
    
    setEditingTask(null);
  };
  
  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };
  
  const handleStatusChange = (id: string, completed: boolean) => {
    updateTaskStatusMutation.mutate({ id, completed });
  };
  
  const openAddTaskDialog = (listId: string) => {
    setNewTaskListId(listId);
    setIsAddTaskOpen(true);
  };
  
  const openEditTaskDialog = async (task: Task) => {
    setEditingTask(task);
  };
  
  // Error handling
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-destructive text-4xl mb-4">
          <ListTodo />
        </div>
        <h3 className="text-xl font-bold">Failed to load tasks</h3>
        <p className="text-muted-foreground mt-2 text-center">
          There was an error loading your tasks. Please try again later.
        </p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-appear-zoom">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-gradient-to-r from-background to-accent/30 p-6 rounded-xl shadow-sm border border-border/50 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-text-gradient relative inline-block">
            Task Manager
            <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-full"></span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks and to-dos with drag and drop functionality.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            onClick={() => openAddTaskDialog("not-started")} 
            className="button-gradient shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
          
          <HoverCard>            
            <HoverCardTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => setIsAddColumnOpen(true)} 
                className="hover-scale bg-gradient-to-r hover:from-brand-blue/5 hover:to-brand-cyan/5 border-brand-blue/20 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg"
              >
                <Columns className="mr-2 h-4 w-4 text-brand-blue" />
                Add Column
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 shadow-lg border-brand-blue/20 animate-scale-in z-50 relative">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold premium-text-gradient">Create Custom Columns</h4>
                <p className="text-sm">
                  Add custom columns to organize your tasks in personalized categories beyond the standard workflow states.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gradient-to-r from-card/80 to-card/50 p-4 rounded-xl border border-brand-blue/10 shadow-md backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8 border-brand-blue/20 focus-visible:ring-brand-blue/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <TaskFilter 
            priorities={["low", "medium", "high", "urgent"]}
            tags={allTags}
            labels={allLabels}
            selectedPriorities={selectedPriorities}
            selectedProjects={selectedProjects}
            selectedTags={selectedTags}
            selectedLabels={selectedLabels}
            onFilterChange={handleFilterChange}
          />
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "board" | "list")} className="hidden md:block">
            <TabsList className="grid w-[120px] grid-cols-2 bg-muted/80">
              <TabsTrigger value="board" className="data-[state=active]:bg-brand-blue/10">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-brand-blue/10">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-brand-blue/10">
                <ListFilter className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-lg border-brand-blue/20">
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem 
                checked={viewMode === "board"}
                onCheckedChange={() => setViewMode("board")}
              >
                <LayoutGrid className="mr-2 h-4 w-4" /> Board
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={viewMode === "list"}
                onCheckedChange={() => setViewMode("list")}
              >
                <List className="mr-2 h-4 w-4" /> List
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Task Board / List View */}
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 shadow-md border-brand-blue/10">
                <Skeleton className="h-5 w-1/2 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : viewMode === "board" ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:auto-cols-fr md:grid-flow-col gap-6 overflow-x-auto pb-4">
              {/* Not Started Column */}
              <Card className="overflow-hidden min-w-[300px] shadow-md border-brand-blue/10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <TaskList
                  id="not-started"
                  title="To Do"
                  tasks={filteredTasks["not-started"] || []}
                  onAddTask={() => openAddTaskDialog("not-started")}
                  onEditTask={openEditTaskDialog}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </Card>
              
              {/* In Progress Column */}
              <Card className="overflow-hidden min-w-[300px] shadow-md border-brand-blue/10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <TaskList
                  id="in-progress"
                  title="In Progress"
                  tasks={filteredTasks["in-progress"] || []}
                  onAddTask={() => openAddTaskDialog("in-progress")}
                  onEditTask={openEditTaskDialog}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </Card>
              
              {/* Completed Column */}
              <Card className="overflow-hidden min-w-[300px] shadow-md border-brand-blue/10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <TaskList
                  id="completed"
                  title="Completed"
                  tasks={filteredTasks["completed"] || []}
                  onEditTask={openEditTaskDialog}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </Card>
              
              {/* Custom Columns */}
              {customColumns.map((column, index) => (
                <Card key={column.id} className="overflow-hidden min-w-[300px] shadow-md border-brand-blue/10 animate-fade-in-up" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                  <div className="h-full flex flex-col">
                    <div 
                      className="flex items-center justify-between p-3 border-b bg-brand-blue/5"
                    >
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold tracking-tight">{column.title}</h3>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-medium">
                          {column.tasks.length}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openAddTaskDialog(column.id)}
                          className="h-8 w-8 p-0 hover:bg-brand-blue/10"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add Task</span>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-brand-blue/10"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Column Options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 shadow-lg border-brand-blue/20">
                            <DropdownMenuItem 
                              onClick={() => setEditingColumn(column)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Column
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => deleteCustomColumn(column.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Column
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <TaskList
                      id={column.id}
                      title={column.title}
                      tasks={column.tasks}
                      onAddTask={() => openAddTaskDialog(column.id)}
                      onEditTask={openEditTaskDialog}
                      onDeleteTask={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </DragDropContext>
        ) : (
          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">All Tasks</h3>
                <Button variant="outline" size="sm" onClick={() => openAddTaskDialog("not-started")}>
                  <PlusCircle className="h-4 w-4 mr-1" /> New Task
                </Button>
              </div>
              
              {/* Render tasks in a list view */}
              <div className="space-y-2">
                {Object.values(filteredTasks).flat().length === 0 && 
                 customColumns.flatMap(column => column.tasks).length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No tasks found</p>
                    <Button className="mt-2" variant="outline" onClick={() => openAddTaskDialog("not-started")}>
                      <Plus className="h-4 w-4 mr-1" /> Create your first task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Standard columns */}
                    {Object.entries(filteredTasks).map(([status, tasks]) => (
                      <div key={status}>
                        {tasks.length > 0 && (
                          <Collapsible className="mb-6">
                            <CollapsibleTrigger className="flex items-center w-full text-left">
                              <h4 className="font-medium text-sm text-muted-foreground mb-2 capitalize">
                                {status.replace(/-/g, ' ')} ({tasks.length})
                              </h4>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-2">
                              {tasks.map((task) => (
                                <div key={task.id} className="border rounded-lg">
                                  <div 
                                    className="p-3 cursor-pointer hover:bg-accent/50"
                                    onClick={() => openEditTaskDialog(task)}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-3">
                                        <div className="pt-1">
                                          <Checkbox
                                            checked={task.status === "completed"}
                                            onCheckedChange={() => handleStatusChange(task.id, !task.status.includes("completed"))}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                        <div>
                                          <h4 className={`font-medium ${
                                            task.status === "completed" ? "line-through text-muted-foreground" : ""
                                          }`}>{task.title}</h4>
                                          
                                          {task.description && (
                                            <p className="text-muted-foreground text-sm line-clamp-2 mt-0.5">{task.description}</p>
                                          )}
                                          
                                          <div className="flex flex-wrap mt-2 gap-1.5">
                                            <span className={`inline-flex items-center text-xs rounded-full px-2 py-0.5 font-medium
                                              ${
                                                task.priority === "low" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                task.priority === "medium" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                                task.priority === "high" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                                                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                              }
                                            `}>
                                              {task.priority}
                                            </span>
                                            
                                            {task.due_date && (
                                              <span className="inline-flex items-center text-xs rounded-full px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-medium">
                                                <CalendarDays className="h-3 w-3 mr-1" />
                                                {format(new Date(task.due_date), "MMM d")}
                                              </span>
                                            )}
                                            
                                            {task.time_estimate && (
                                              <span className="inline-flex items-center text-xs rounded-full px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {task.time_estimate}m
                                              </span>
                                            )}
                                            
                                            {task.is_recurring && (
                                              <span className="inline-flex items-center text-xs rounded-full px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium">
                                                Recurring
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="sm">•••</Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuGroup>
                                              <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation();
                                                openEditTaskDialog(task);
                                              }}>
                                                Edit
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(task.id, !task.status.includes("completed"));
                                              }}>
                                                Mark as {task.status === "completed" ? "Incomplete" : "Complete"}
                                              </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              className="text-destructive"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.id);
                                              }}
                                            >
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    ))}
                    
                    {/* Custom columns */}
                    {customColumns.map(column => (
                      <div key={column.id}>
                        {column.tasks.length > 0 && (
                          <Collapsible className="mb-6">
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                              <h4 className="font-medium text-sm text-muted-foreground mb-2 capitalize">
                                {column.title} ({column.tasks.length})
                              </h4>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingColumn(column);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCustomColumn(column.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-2">
                              {column.tasks.map((task) => (
                                <div key={task.id} className="border rounded-lg">
                                  <div 
                                    className="p-3 cursor-pointer hover:bg-accent/50"
                                    onClick={() => openEditTaskDialog(task)}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-3">
                                        <div className="pt-1">
                                          <Checkbox
                                            checked={task.status === "completed"}
                                            onCheckedChange={() => handleStatusChange(task.id, !task.status.includes("completed"))}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                        <div>
                                          <h4 className={`font-medium ${
                                            task.status === "completed" ? "line-through text-muted-foreground" : ""
                                          }`}>{task.title}</h4>
                                          
                                          {task.description && (
                                            <p className="text-muted-foreground text-sm line-clamp-2 mt-0.5">{task.description}</p>
                                          )}
                                          
                                          <div className="flex flex-wrap mt-2 gap-1.5">
                                            <span className={`inline-flex items-center text-xs rounded-full px-2 py-0.5 font-medium
                                              ${
                                                task.priority === "low" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                task.priority === "medium" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                                task.priority === "high" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                                                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                              }
                                            `}>
                                              {task.priority}
                                            </span>
                                            
                                            {task.due_date && (
                                              <span className="inline-flex items-center text-xs rounded-full px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-medium">
                                                <CalendarDays className="h-3 w-3 mr-1" />
                                                {format(new Date(task.due_date), "MMM d")}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="sm">•••</Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => {
                                              e.stopPropagation();
                                              openEditTaskDialog(task);
                                            }}>
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              className="text-destructive"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                
                                                // Remove from custom column
                                                const updatedColumns = customColumns.map(col => {
                                                  if (col.id === column.id) {
                                                    return {
                                                      ...col,
                                                      tasks: col.tasks.filter(t => t.id !== task.id)
                                                    };
                                                  }
                                                  return col;
                                                });
                                                setCustomColumns(updatedColumns);
                                                
                                                // Also delete from database if needed
                                                handleDeleteTask(task.id);
                                              }}
                                            >
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task with details and properties.
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
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details and settings.
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm 
              initialData={editingTask}
              onSubmit={handleEditTask}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Column Dialog */}
      <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Custom Column</DialogTitle>
            <DialogDescription>
              Create a new column to organize tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="column-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Column Title
              </label>
              <Input
                id="column-title"
                placeholder="Enter column title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddColumnOpen(false)}>Cancel</Button>
            <Button onClick={addCustomColumn}>Add Column</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Column Dialog */}
      <Dialog open={!!editingColumn} onOpenChange={(open) => !open && setEditingColumn(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
            <DialogDescription>
              Update column details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-column-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Column Title
              </label>
              <Input
                id="edit-column-title"
                placeholder="Enter column title"
                value={editingColumn?.title || ''}
                onChange={(e) => setEditingColumn(prev => prev ? {...prev, title: e.target.value} : null)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingColumn(null)}>Cancel</Button>
            <Button onClick={updateCustomColumn}>Update Column</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManager;

// Helper function for memoization
function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const [state, setState] = useState<T>(factory);
  
  useEffect(() => {
    const newState = factory();
    setState(newState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  return state;
}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-x-auto">
  {/* Standard columns */}
  {/* <TaskList
    id="not-started"
    title="Not Started"
    tasks={filteredTasks['not-started'] || []}
    onAddTask={() => {
      setNewTaskListId('not-started');
      setIsAddTaskOpen(true);
    }}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onStatusChange={handleTaskStatusChange}
  /> */}
  
  {/* <TaskList
    id="in-progress"
    title="In Progress"
    tasks={tasksData?.['in-progress'] || []}ger
    onAddTask={() => {
      setNewTaskListId('in-progress');
      setIsAddTaskOpen(true);
    }}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onStatusChange={handleTaskStatusChange}
  /> */}
  
  {/* <TaskList
    id="completed"
    title="Completed"
    tasks={filteredTasks['completed'] || []}
    onAddTask={() => {
      setNewTaskListId('completed');
      setIsAddTaskOpen(true);
    }}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onStatusChange={handleTaskStatusChange}
  /> */}
  
  {/* Custom columns */}
  {/* {customColumns.map(column => (
    <TaskList
      key={column.id}
      id={column.id}
      title={column.title}
      tasks={column.tasks}
      onAddTask={() => handleAddTaskToCustomColumn(column.id)}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onStatusChange={handleTaskStatusChange}
    />
  ))} */}
</div>
function setNewTaskListId(arg0: string) {
  throw new Error("Function not implemented.");
}

function setIsAddTaskOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function handleEditTask(task: Task): void {
  throw new Error("Function not implemented.");
}

function handleDeleteTask(id: string): void {
  throw new Error("Function not implemented.");
}

function handleTaskStatusChange(id: string, completed: boolean): void {
  throw new Error("Function not implemented.");
}

function handleAddTaskToCustomColumn(id: any): void {
  throw new Error("Function not implemented.");
}

