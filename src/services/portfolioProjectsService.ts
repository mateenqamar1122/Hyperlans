
import { supabase } from "@/integrations/supabase/client";
import { DbPortfolioProject } from "@/types/portfolio";
import { toast } from "sonner";

export const getPortfolioProjects = async (): Promise<DbPortfolioProject[]> => {
  try {
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Add the missing properties to match DbPortfolioProject type
    const projectsWithDefaults = data.map(project => ({
      ...project,
      portfolio_id: project.portfolio_id || null,
      featured: project.is_featured || false
    }));
    
    return projectsWithDefaults as DbPortfolioProject[];
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    toast.error('Failed to load portfolio projects');
    return [];
  }
};

export const getPortfolioProjectById = async (id: string): Promise<DbPortfolioProject | null> => {
  try {
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Add the missing properties to match DbPortfolioProject type
    const projectWithDefaults = {
      ...data,
      portfolio_id: data.portfolio_id || null,
      featured: data.is_featured || false
    };
    
    return projectWithDefaults as DbPortfolioProject;
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    toast.error('Failed to load portfolio project details');
    return null;
  }
};

export const createPortfolioProject = async (
  project: Omit<DbPortfolioProject, 'id' | 'created_at' | 'updated_at'>
): Promise<DbPortfolioProject | null> => {
  try {
    // Prepare the data for insertion, mapping from our type to DB schema
    const insertData = {
      title: project.title,
      client: project.client,
      description: project.description,
      image_url: project.image_url,
      type: project.type,
      status: project.status,
      tags: project.tags,
      technologies: project.technologies,
      testimonial: project.testimonial,
      url: project.url,
      github_url: project.github_url,
      features: project.features,
      start_date: project.start_date,
      completion_date: project.completion_date,
      is_featured: project.featured
    };
    
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([insertData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Add the missing properties to match DbPortfolioProject type
    const projectWithDefaults = {
      ...data,
      portfolio_id: data.portfolio_id || null,
      featured: data.is_featured || false
    };
    
    toast.success('Portfolio project created successfully');
    return projectWithDefaults as DbPortfolioProject;
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    toast.error('Failed to create portfolio project');
    return null;
  }
};

export const updatePortfolioProject = async (
  id: string, 
  project: Partial<DbPortfolioProject>
): Promise<DbPortfolioProject | null> => {
  try {
    // Map our type to DB schema for the update
    const updateData: any = { ...project };
    
    // Map 'featured' to 'is_featured' if it exists
    if (project.featured !== undefined) {
      updateData.is_featured = project.featured;
      delete updateData.featured;
    }
    
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add the missing properties to match DbPortfolioProject type
    const projectWithDefaults = {
      ...data,
      portfolio_id: data.portfolio_id || null,
      featured: data.is_featured || false
    };
    
    toast.success('Portfolio project updated successfully');
    return projectWithDefaults as DbPortfolioProject;
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    toast.error('Failed to update portfolio project');
    return null;
  }
};

export const deletePortfolioProject = async (id: string): Promise<boolean> => {
  try {
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Portfolio project deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    toast.error('Failed to delete portfolio project');
    return false;
  }
};