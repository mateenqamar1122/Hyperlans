import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  role: 'user' | 'model'; // Gemini uses 'user' and 'model' instead of 'assistant'
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface SavedResponse {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export const sendMessage = async (
  message: string, 
  previousMessages: Message[] = []
): Promise<Message | null> => {
  try {
    const initialContext = `You are a helpful AI assistant for freelancers and small business owners. Provide concise, practical advice. Be friendly and professional.`;

    const payloadMessages = previousMessages.length === 0
      ? [{ role: 'user', content: `${initialContext}\n\n${message}` }]
      : [...previousMessages, { role: 'user', content: message }];

    const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
      body: { messages: payloadMessages }
    });

    if (error) {
      console.error('Error calling AI assistant:', error);
      throw error;
    }

    return {
      role: 'model',
      content: data.response || 'Sorry, I was unable to generate a response.'
    };
  } catch (error: any) {
    console.error('Error sending message to AI assistant:', error);
    toast.error(`Failed to get response: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const saveChatSession = async (title: string, messages: Message[]): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .insert({
        user_id: userData.user.id,
        title,
        messages: messages as any
      })
      .select('id')
      .single();

    if (error) throw error;

    toast.success('Chat session saved successfully');
    return data.id;
  } catch (error: any) {
    console.error('Error saving chat session:', error);
    toast.error(`Failed to save chat session: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const getChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ...item,
      messages: item.messages as unknown as Message[]
    })) as ChatSession[];
  } catch (error: any) {
    console.error('Error fetching chat sessions:', error);
    toast.error(`Failed to load chat sessions: ${error.message || 'Unknown error'}`);
    return [];
  }
};

export const saveResponse = async (title: string, content: string): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('ai_saved_responses')
      .insert({
        user_id: userData.user.id,
        title,
        content
      })
      .select('id')
      .single();

    if (error) throw error;

    toast.success('Response saved successfully');
    return data.id;
  } catch (error: any) {
    console.error('Error saving response:', error);
    toast.error(`Failed to save response: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const getSavedResponses = async (): Promise<SavedResponse[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_saved_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as SavedResponse[];
  } catch (error: any) {
    console.error('Error fetching saved responses:', error);
    toast.error(`Failed to load saved responses: ${error.message || 'Unknown error'}`);
    return [];
  }
};

export const deleteSavedResponse = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ai_saved_responses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Saved response deleted');
    return true;
  } catch (error: any) {
    console.error('Error deleting saved response:', error);
    toast.error(`Failed to delete saved response: ${error.message || 'Unknown error'}`);
    return false;
  }
};

export const deleteChatSession = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ai_chat_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Chat session deleted');
    return true;
  } catch (error: any) {
    console.error('Error deleting chat session:', error);
    toast.error(`Failed to delete chat session: ${error.message || 'Unknown error'}`);
    return false;
  }
};

export const getChatSessionById = async (id: string): Promise<ChatSession | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      messages: data.messages as unknown as Message[]
    } as ChatSession;
  } catch (error: any) {
    console.error('Error fetching chat session:', error);
    toast.error(`Failed to load chat session: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const updateChatSession = async (id: string, messages: Message[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ai_chat_sessions')
      .update({ 
        messages: messages as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error updating chat session:', error);
    return false;
  }
};
    