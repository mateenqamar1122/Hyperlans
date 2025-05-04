
import { supabase } from "@/integrations/supabase/client";
import { ProjectNote } from "@/types/database";
import { toast } from "sonner";

export const getProjectNotes = async (projectId: string): Promise<ProjectNote[]> => {
  try {
    const { data, error } = await supabase
      .from('project_notes')
      .select('*, author:author_id(id, name, role, avatar_url)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ProjectNote[];
  } catch (error) {
    console.error('Error fetching project notes:', error);
    toast.error('Failed to load project notes');
    return [];
  }
};

export const createProjectNote = async (note: Omit<ProjectNote, 'id' | 'created_at' | 'updated_at' | 'author'>): Promise<ProjectNote | null> => {
  try {
    const { data, error } = await supabase
      .from('project_notes')
      .insert([note])
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Note added successfully');
    return data as ProjectNote;
  } catch (error) {
    console.error('Error creating note:', error);
    toast.error('Failed to add note');
    return null;
  }
};

export const updateProjectNote = async (id: string, updates: Partial<ProjectNote>): Promise<ProjectNote | null> => {
  try {
    const { data, error } = await supabase
      .from('project_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Note updated successfully');
    return data as ProjectNote;
  } catch (error) {
    console.error('Error updating note:', error);
    toast.error('Failed to update note');
    return null;
  }
};

export const deleteProjectNote = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_notes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Note deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    toast.error('Failed to delete note');
    return false;
  }
};
