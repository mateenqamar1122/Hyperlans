
import { supabase } from "@/integrations/supabase/client";
import { Experience } from "@/types/portfolio";

export const getPortfolioExperiences  = async (portfolioId: string): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_experiences")
      .select("*")
      .eq("portfolio_id", portfolioId);

    if (error) {
      console.error("Error fetching experiences:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getExperiences:", error);
    return [];
  }
};

export const createExperience = async (experience: Omit<Experience, 'id'>): Promise<Experience | null> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_experiences")
      .insert(experience)
      .select()
      .single();

    if (error) {
      console.error("Error creating experience:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createExperience:", error);
    return null;
  }
};

export const updateExperience = async (experience: Experience): Promise<Experience | null> => {
  try {
    if (!experience.id) {
      console.error("Experience ID is required for update");
      return null;
    }

    const { data, error } = await supabase
      .from("portfolio_experiences")
      .update(experience)
      .eq("id", experience.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating experience:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in updateExperience:", error);
    return null;
  }
};

export const deleteExperience = async (experienceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("portfolio_experiences")
      .delete()
      .eq("id", experienceId);

    if (error) {
      console.error("Error deleting experience:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteExperience:", error);
    return false;
  }
};
