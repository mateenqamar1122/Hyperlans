
import { supabase } from "@/integrations/supabase/client";
import { Skill } from "@/types/portfolio";

export const getPortfolioSkills = async (portfolioId: string): Promise<Skill[]> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_skills")
      .select("*")
      .eq("portfolio_id", portfolioId);

    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getSkills:", error);
    return [];
  }
};

export const createSkill = async (skill: Omit<Skill, 'id'>): Promise<Skill | null> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_skills")
      .insert(skill)
      .select()
      .single();

    if (error) {
      console.error("Error creating skill:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createSkill:", error);
    return null;
  }
};

export const updateSkill = async (skill: Skill): Promise<Skill | null> => {
  try {
    if (!skill.id) {
      console.error("Skill ID is required for update");
      return null;
    }

    const { data, error } = await supabase
      .from("portfolio_skills")
      .update(skill)
      .eq("id", skill.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating skill:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in updateSkill:", error);
    return null;
  }
};

export const deleteSkill = async (skillId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("portfolio_skills")
      .delete()
      .eq("id", skillId);

    if (error) {
      console.error("Error deleting skill:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteSkill:", error);
    return false;
  }
};
