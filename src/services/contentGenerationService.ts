import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContentGeneration {
  id: string;
  title: string;
  prompt: string;
  content: string;
  content_type: string;
  tone?: string | null;
  tags?: string[] | null;
  is_favorite?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ContentGenerationRequest {
  prompt: string;
  contentType: string;
  tone?: string;
  instructions?: string;
}

export const generateContent = async (request: ContentGenerationRequest): Promise<string | null> => {
  try {
    const combinedPrompt = [
      request.instructions ? `Instructions: ${request.instructions}` : null,
      `Prompt: ${request.prompt}`
    ].filter(Boolean).join("\n\n");

    const { data, error } = await supabase.functions.invoke("generate-content", {
      body: {
        prompt: combinedPrompt,
        contentType: request.contentType,
        tone: request.tone,
       
      },
    });

    if (error) {
      toast.error(`Failed to generate content: ${error.message}`);
      return null;
    }

    if (data.error) {
      const errorMessage =
        typeof data.details === "object" && data.details?.error?.message
          ? data.details.error.message
          : data.error;

      if (errorMessage.includes("API key")) {
        toast.error("API key error - Please check your Gemini API key configuration");
      } else {
        toast.error(`Failed to generate content: ${errorMessage}`);
      }
      return null;
    }

    return data.content;
  } catch (error: any) {
    toast.error("Failed to generate content");
    return null;
  }
};

export const saveContentGeneration = async (
  generation: Omit<ContentGeneration, "id" | "created_at" | "updated_at">
): Promise<ContentGeneration | null> => {
  try {
    const { data, error } = await supabase
      .from("content_generations")
      .insert([generation])
      .select()
      .single();

    if (error) throw error;

    toast.success("Content saved successfully");
    return data as ContentGeneration;
  } catch (error: any) {
    toast.error("Failed to save content");
    return null;
  }
};

export const getContentGenerations = async (): Promise<ContentGeneration[]> => {
  try {
    const { data, error } = await supabase
      .from("content_generations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as ContentGeneration[];
  } catch (error: any) {
    toast.error("Failed to load saved content");
    return [];
  }
};

export const updateContentGeneration = async (
  id: string,
  updates: Partial<ContentGeneration>
): Promise<ContentGeneration | null> => {
  try {
    const { data, error } = await supabase
      .from("content_generations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    toast.success("Content updated successfully");
    return data as ContentGeneration;
  } catch (error: any) {
    toast.error("Failed to update content");
    return null;
  }
};

export const deleteContentGeneration = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("content_generations")
      .delete()
      .eq("id", id);

    if (error) throw error;

    toast.success("Content deleted successfully");
    return true;
  } catch (error: any) {
    toast.error("Failed to delete content");
    return false;
  }
};

export const toggleFavorite = async (
  id: string,
  isFavorite: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("content_generations")
      .update({ is_favorite: isFavorite })
      .eq("id", id);

    if (error) throw error;

    toast.success(isFavorite ? "Added to favorites" : "Removed from favorites");
    return true;
  } catch (error: any) {
    toast.error("Failed to update favorite status");
    return false;
  }
};
