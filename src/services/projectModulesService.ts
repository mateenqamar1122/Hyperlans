
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProjectModule {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const getProjectModules = async (projectId: string): Promise<ProjectModule[]> => {
  try {
    const { data, error } = await supabase
      .from('project_modules')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');
    
    if (error) throw error;
    
    return data as ProjectModule[];
  } catch (error) {
    console.error('Error fetching project modules:', error);
    toast.error('Failed to load project modules');
    return [];
  }
};

export const createProjectModule = async (module: Omit<ProjectModule, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectModule | null> => {
  try {
    const { data, error } = await supabase
      .from('project_modules')
      .insert([module])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Module added successfully');
    return data as ProjectModule;
  } catch (error) {
    console.error('Error creating module:', error);
    toast.error('Failed to add module');
    return null;
  }
};

export const updateProjectModule = async (id: string, updates: Partial<ProjectModule>): Promise<ProjectModule | null> => {
  try {
    const { data, error } = await supabase
      .from('project_modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Module updated successfully');
    return data as ProjectModule;
  } catch (error) {
    console.error('Error updating module:', error);
    toast.error('Failed to update module');
    return null;
  }
};

export const deleteProjectModule = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_modules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Module deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting module:', error);
    toast.error('Failed to delete module');
    return false;
  }
};
