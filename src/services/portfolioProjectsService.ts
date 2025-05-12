
import { supabase } from "@/integrations/supabase/client";
import { PortfolioProject } from "@/types/portfolio";

export const getPortfolioProjects = async (portfolioId: string): Promise<PortfolioProject[]> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("portfolio_id", portfolioId);

    if (error) {
      console.error("Error fetching portfolio projects:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getPortfolioProjects:", error);
    return [];
  }
};

export const createPortfolioProject = async (project: Omit<PortfolioProject, 'id'>): Promise<PortfolioProject | null> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error("Error creating portfolio project:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createPortfolioProject:", error);
    return null;
  }
};

export const updatePortfolioProject = async (project: PortfolioProject): Promise<PortfolioProject | null> => {
  try {
    if (!project.id) {
      console.error("Project ID is required for update");
      return null;
    }

    const { data, error } = await supabase
      .from("portfolio_projects")
      .update(project)
      .eq("id", project.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating portfolio project:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in updatePortfolioProject:", error);
    return null;
  }
};

export const deletePortfolioProject = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting portfolio project:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deletePortfolioProject:", error);
    return false;
  }
};
