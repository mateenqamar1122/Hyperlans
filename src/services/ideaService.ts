
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Idea {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: string | null;
  stage: 'draft' | 'evaluating' | 'approved' | 'in_progress' | 'completed';
  votes_count: number;
  estimated_budget: number | null;
  estimated_effort: string | null;
  target_completion_date: string | null;
  rich_content: any | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  tags?: IdeaTag[];
  attachments?: IdeaAttachment[];
}

export interface IdeaTag {
  id: string;
  name: string;
  idea_id: string;
  created_at: string;
}

export interface IdeaAttachment {
  id: string;
  idea_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  created_at: string;
}

export interface IdeaVote {
  id: string;
  idea_id: string;
  user_id: string;
  vote_type: string;
  created_at: string;
}

export const fetchIdeas = async () => {
  try {
    const { data: ideas, error } = await supabase
      .from('ideas')
      .select(`
        *,
        tags:idea_tags(*),
        attachments:idea_attachments(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return ideas as Idea[];
  } catch (error) {
    console.error('Error fetching ideas:', error);
    toast.error('Failed to load ideas');
    return [];
  }
};

export const createIdea = async (idea: Partial<Idea>) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .insert([idea])
      .select()
      .single();

    if (error) throw error;
    toast.success('Idea created successfully');
    return data;
  } catch (error) {
    console.error('Error creating idea:', error);
    toast.error('Failed to create idea');
    return null;
  }
};

export const updateIdea = async (id: string, updates: Partial<Idea>) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Idea updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating idea:', error);
    toast.error('Failed to update idea');
    return null;
  }
};

export const deleteIdea = async (id: string) => {
  try {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Idea deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting idea:', error);
    toast.error('Failed to delete idea');
    return false;
  }
};

export const voteForIdea = async (ideaId: string, voteType: string) => {
  try {
    const { data, error } = await supabase
      .from('idea_votes')
      .insert([{ idea_id: ideaId, vote_type: voteType }])
      .select()
      .single();

    if (error) throw error;
    toast.success('Vote recorded successfully');
    return data;
  } catch (error) {
    console.error('Error voting for idea:', error);
    toast.error('Failed to record vote');
    return null;
  }
};

export const addTagToIdea = async (ideaId: string, tagName: string) => {
  try {
    const { data, error } = await supabase
      .from('idea_tags')
      .insert([{ idea_id: ideaId, name: tagName }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding tag:', error);
    toast.error('Failed to add tag');
    return null;
  }
};

export const uploadAttachment = async (ideaId: string, file: File) => {
  try {
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('idea-attachments')
      .upload(`${ideaId}/${file.name}`, file);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('idea_attachments')
      .insert([{
        idea_id: ideaId,
        file_name: file.name,
        file_type: file.type,
        file_url: uploadData.path
      }])
      .select()
      .single();

    if (error) throw error;
    toast.success('File uploaded successfully');
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    return null;
  }
};
