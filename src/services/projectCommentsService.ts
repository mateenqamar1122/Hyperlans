
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/database";
import { toast } from "sonner";

interface ProjectComment {
  id: string;
  project_id: string;
  author_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  author?: TeamMember;
}

export const getProjectComments = async (projectId: string): Promise<ProjectComment[]> => {
  try {
    const { data, error } = await supabase
      .from('project_comments')
      .select('*, author:author_id(id, name, role, avatar_url)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as ProjectComment[];
  } catch (error) {
    console.error('Error fetching project comments:', error);
    toast.error('Failed to load project comments');
    return [];
  }
};

export const createProjectComment = async (comment: Omit<ProjectComment, 'id' | 'created_at' | 'updated_at' | 'author'>): Promise<ProjectComment | null> => {
  try {
    const { data, error } = await supabase
      .from('project_comments')
      .insert([comment])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Comment added successfully');
    return data as ProjectComment;
  } catch (error) {
    console.error('Error creating comment:', error);
    toast.error('Failed to add comment');
    return null;
  }
};

export const updateProjectComment = async (id: string, updates: Partial<ProjectComment>): Promise<ProjectComment | null> => {
  try {
    const { data, error } = await supabase
      .from('project_comments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Comment updated successfully');
    return data as ProjectComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    toast.error('Failed to update comment');
    return null;
  }
};

export const deleteProjectComment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Comment deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    toast.error('Failed to delete comment');
    return false;
  }
};
