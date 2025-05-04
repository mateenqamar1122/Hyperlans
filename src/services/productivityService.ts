import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "not-started" | "in-progress" | "completed";
  time_estimate: number | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_id?: string | null;
  tags?: string[] | null;
  related_tasks?: string[] | null;
  labels?: string[] | null;
  is_recurring?: boolean;
  recurring_pattern?: string | null;
  last_updated_by?: string | null;
}

// Pomodoro Types
export interface PomodoroSession {
  id: string;
  start_time: string;
  end_time: string | null;
  duration: number;
  session_type: "work" | "short-break" | "long-break";
  task_id: string | null;
  created_at: string;
  user_id: string;
}

// Goal Types
export interface Goal {
  id: string;
  title: string;
  type: string;
  target: string;
  current: string;
  progress: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  location: string | null;
  start_time: string;
  end_time: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Tasks CRUD Operations
export async function getTasks() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as Task[];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function getTaskById(id: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Task;
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
}

export async function getTasksByStatus(status: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', status)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as Task[];
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    return [];
  }
}

export async function getTasksGroupedByStatus() {
  try {
    const tasks = await getTasks();
    
    const notStarted = tasks.filter(task => task.status === 'not-started');
    const inProgress = tasks.filter(task => task.status === 'in-progress');
    const completed = tasks.filter(task => task.status === 'completed');
    
    return { 
      "not-started": notStarted,
      "in-progress": inProgress,
      "completed": completed
    };
  } catch (error) {
    console.error('Error grouping tasks by status:', error);
    return { 
      "not-started": [],
      "in-progress": [],
      "completed": []
    };
  }
}

export async function getTasksByProject(projectId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as Task[];
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    return [];
  }
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const taskWithUserId = { 
      ...task, 
      user_id: user.id,
      last_updated_by: user.id
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskWithUserId])
      .select()
      .single();

    if (error) throw error;
    toast.success('Task created successfully');
    return data as Task;
  } catch (error) {
    console.error('Error creating task:', error);
    toast.error('Failed to create task');
    return null;
  }
}

export async function updateTask(id: string, task: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const taskWithUpdater = { 
      ...task, 
      last_updated_by: user.id 
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(taskWithUpdater)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Task updated successfully');
    return data as Task;
  } catch (error) {
    console.error('Error updating task:', error);
    toast.error('Failed to update task');
    return null;
  }
}

export async function updateTaskStatus(id: string, status: "not-started" | "in-progress" | "completed") {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status, 
        last_updated_by: user.id 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  } catch (error) {
    console.error('Error updating task status:', error);
    toast.error('Failed to update task status');
    return null;
  }
}

export async function bulkUpdateTasks(ids: string[], updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const updatesWithUser = { 
      ...updates, 
      last_updated_by: user.id 
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updatesWithUser)
      .in('id', ids)
      .select();

    if (error) throw error;
    toast.success('Tasks updated successfully');
    return data as Task[];
  } catch (error) {
    console.error('Error updating tasks:', error);
    toast.error('Failed to update tasks');
    return null;
  }
}

export async function deleteTask(id: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Task deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error('Failed to delete task');
    return false;
  }
}

export async function bulkDeleteTasks(ids: string[]) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', ids);

    if (error) throw error;
    toast.success('Tasks deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting tasks:', error);
    toast.error('Failed to delete tasks');
    return false;
  }
}

// Pomodoro Sessions CRUD
export async function getPomodoroSessions() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data as PomodoroSession[];
  } catch (error) {
    console.error('Error fetching pomodoro sessions:', error);
    return [];
  }
}

export async function createPomodoroSession(session: Omit<PomodoroSession, 'id' | 'created_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const sessionWithUserId = { ...session, user_id: user.id };

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert([sessionWithUserId])
      .select()
      .single();

    if (error) throw error;
    return data as PomodoroSession;
  } catch (error) {
    console.error('Error creating pomodoro session:', error);
    toast.error('Failed to save pomodoro session');
    return null;
  }
}

export async function updatePomodoroSession(id: string, session: Partial<Omit<PomodoroSession, 'id' | 'created_at' | 'user_id'>>) {
  try {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .update(session)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PomodoroSession;
  } catch (error) {
    console.error('Error updating pomodoro session:', error);
    return null;
  }
}

// Goals CRUD Operations
export async function getGoals() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Goal[];
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const goalWithUserId = { ...goal, user_id: user.id };

    const { data, error } = await supabase
      .from('goals')
      .insert([goalWithUserId])
      .select()
      .single();

    if (error) throw error;
    toast.success('Goal created successfully');
    return data as Goal;
  } catch (error) {
    console.error('Error creating goal:', error);
    toast.error('Failed to create goal');
    return null;
  }
}

export async function updateGoal(id: string, goal: Partial<Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) {
  try {
    const { data, error } = await supabase
      .from('goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Goal updated successfully');
    return data as Goal;
  } catch (error) {
    console.error('Error updating goal:', error);
    toast.error('Failed to update goal');
    return null;
  }
}

export async function deleteGoal(id: string) {
  try {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Goal deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    toast.error('Failed to delete goal');
    return false;
  }
}

// Calendar Events CRUD
export async function getEvents() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const eventWithUserId = { ...event, user_id: user.id };

    const { data, error } = await supabase
      .from('events')
      .insert([eventWithUserId])
      .select()
      .single();

    if (error) throw error;
    toast.success('Event created successfully');
    return data as Event;
  } catch (error) {
    console.error('Error creating event:', error);
    toast.error('Failed to create event');
    return null;
  }
}

export async function updateEvent(id: string, event: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Event updated successfully');
    return data as Event;
  } catch (error) {
    console.error('Error updating event:', error);
    toast.error('Failed to update event');
    return null;
  }
}

export async function deleteEvent(id: string) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Event deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    toast.error('Failed to delete event');
    return false;
  }
}
