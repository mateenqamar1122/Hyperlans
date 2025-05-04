
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string | null;
  phone?: string | null;
  department?: string | null;
  location?: string | null;
  bio?: string | null;
  status?: 'active' | 'unavailable' | 'on-leave' | null;
}

// Get all team members
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as TeamMember[];
  } catch (error) {
    console.error('Error fetching team members:', error);
    toast.error('Failed to load team members');
    return [];
  }
};

// Get a single team member by ID
export const getTeamMember = async (id: string): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as TeamMember;
  } catch (error) {
    console.error('Error fetching team member:', error);
    toast.error('Failed to load team member details');
    return null;
  }
};

// Create a new team member
export const createTeamMember = async (teamMember: Omit<TeamMember, 'id' | 'created_at'>): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert([teamMember])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Team member added successfully');
    return data as TeamMember;
  } catch (error) {
    console.error('Error creating team member:', error);
    toast.error('Failed to add team member');
    return null;
  }
};

// Update an existing team member
export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Team member updated successfully');
    return data as TeamMember;
  } catch (error) {
    console.error('Error updating team member:', error);
    toast.error('Failed to update team member');
    return null;
  }
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Team member removed successfully');
    return true;
  } catch (error) {
    console.error('Error deleting team member:', error);
    toast.error('Failed to remove team member');
    return false;
  }
};

// Get team statistics
export const getTeamStatistics = async (): Promise<{
  totalMembers: number;
  activeMembers: number;
  departments: {name: string, count: number}[];
  roles: {name: string, count: number}[];
} | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*');
    
    if (error) throw error;
    
    const members = data as TeamMember[];
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'active' || m.status === null).length;
    
    // Group members by department
    const departmentsMap = new Map<string, number>();
    members.forEach(member => {
      const dept = member.department || 'Unassigned';
      departmentsMap.set(dept, (departmentsMap.get(dept) || 0) + 1);
    });
    const departments = Array.from(departmentsMap.entries()).map(([name, count]) => ({ name, count }));
    
    // Group members by role
    const rolesMap = new Map<string, number>();
    members.forEach(member => {
      const role = member.role || 'Unassigned';
      rolesMap.set(role, (rolesMap.get(role) || 0) + 1);
    });
    const roles = Array.from(rolesMap.entries()).map(([name, count]) => ({ name, count }));
    
    return { totalMembers, activeMembers, departments, roles };
  } catch (error) {
    console.error('Error fetching team statistics:', error);
    toast.error('Failed to load team statistics');
    return null;
  }
};

// Get the current user's profile
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update the current user's profile
export const updateUserProfile = async (updates: Partial<{
  display_name: string;
  avatar_url: string;
}>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No authenticated user');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Profile updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile');
    return null;
  }
};
