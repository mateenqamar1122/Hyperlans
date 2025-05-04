import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectTeam, TeamMember } from "@/types/database";
import { toast } from "sonner";

export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, clients(name, company), project_team(team_member_id)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(project => ({
      ...project,
      team: [] as TeamMember[],
      teamCount: project.project_team ? project.project_team.length : 0
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error('Failed to load projects');
    return [];
  }
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        clients(*),
        project_team(
          *,
          team_members(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const teamMembers = data.project_team && Array.isArray(data.project_team) 
      ? data.project_team.map((pt: any) => ({
          ...pt.team_members,
          project_role: pt.role
        }))
      : [];
    
    return {
      ...data,
      team: teamMembers
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    toast.error('Failed to load project details');
    return null;
  }
};

export const createProject = async (
  project: Omit<Project, 'id' | 'created_at' | 'updated_at'>,
  teamIds?: string[]
): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    
    if (teamIds && teamIds.length > 0) {
      const teamAssignments = teamIds.map(teamMemberId => ({
        project_id: data.id,
        team_member_id: teamMemberId
      }));
      
      const { error: teamError } = await supabase
        .from('project_team')
        .insert(teamAssignments);
      
      if (teamError) throw teamError;
    }
    
    toast.success('Project created successfully');
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    toast.error('Failed to create project');
    return null;
  }
};

export const updateProject = async (
  id: string, 
  project: Partial<Project>,
  teamIds?: string[]
): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (teamIds) {
      const { error: deleteError } = await supabase
        .from('project_team')
        .delete()
        .eq('project_id', id);
      
      if (deleteError) throw deleteError;
      
      if (teamIds.length > 0) {
        const teamAssignments = teamIds.map(teamMemberId => ({
          project_id: id,
          team_member_id: teamMemberId
        }));
        
        const { error: teamError } = await supabase
          .from('project_team')
          .insert(teamAssignments);
        
        if (teamError) throw teamError;
      }
    }
    
    toast.success('Project updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    toast.error('Failed to update project');
    return null;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Project deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    toast.error('Failed to delete project');
    return false;
  }
};

export const updateProjectProgress = async (id: string, progress: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .update({ progress })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Progress updated');
    return true;
  } catch (error) {
    console.error('Error updating progress:', error);
    toast.error('Failed to update progress');
    return false;
  }
};

export const getTeamMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    toast.error('Failed to load team members');
    return [];
  }
};

export const createTeamMember = async (
  teamMember: { name: string; role?: string; email?: string }
): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert([teamMember])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Team member added successfully');
    return data;
  } catch (error) {
    console.error('Error creating team member:', error);
    toast.error('Failed to create team member');
    return null;
  }
};

export const updateTeamMember = async (
  id: string,
  teamMember: Partial<TeamMember>
): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update(teamMember)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Team member updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating team member:', error);
    toast.error('Failed to update team member');
    return null;
  }
};

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  try {
    const { error: projectTeamError } = await supabase
      .from('project_team')
      .delete()
      .eq('team_member_id', id);
    
    if (projectTeamError) throw projectTeamError;
    
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Team member deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting team member:', error);
    toast.error('Failed to delete team member');
    return false;
  }
};   