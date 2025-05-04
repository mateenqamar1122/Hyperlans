
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

// Dashboard Data Types
export interface DashboardStats {
  id: string;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  tasks_completion_rate: number;
  monthly_revenue: number;
  last_month_revenue: number;
  yearly_revenue: number;
  last_updated: string;
  user_id: string;
}

export interface RevenueData {
  id: string;
  month: number;
  year: number;
  amount: number;
  created_at: string;
  user_id: string;
}

export interface ProjectProgressData {
  id: string;
  project_id: string;
  week_number: number;
  year: number;
  progress_percentage: number;
  created_at: string;
  user_id: string;
}

// Get Dashboard Stats
export async function getDashboardStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from("dashboard_stats")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    
    if (data) {
      return data as DashboardStats;
    } else {
      // If no stats exist yet, create default stats
      const projects = await getProjectStats();
      const stats = {
        total_projects: projects.total,
        active_projects: projects.active,
        completed_projects: projects.completed,
        tasks_completion_rate: 0,
        monthly_revenue: 0,
        last_month_revenue: 0,
        yearly_revenue: 0,
        user_id: user.id
      };
      
      const { data: newStats, error: insertError } = await supabase
        .from("dashboard_stats")
        .insert(stats)
        .select()
        .single();
        
      if (insertError) throw insertError;
      return newStats as DashboardStats;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

// Get project statistics
export async function getProjectStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('projects')
      .select('id, status');

    if (error) throw error;

    const projects = data as Project[];
    const total = projects.length;
    const active = projects.filter(p => p.status === 'in-progress' || p.status === 'pending').length;
    const completed = projects.filter(p => p.status === 'completed').length;

    return { total, active, completed };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return { total: 0, active: 0, completed: 0 };
  }
}

// Get revenue history
export async function getRevenueHistory(year: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('revenue_history')
      .select('*')
      .eq('year', year)
      .eq('user_id', user.id)
      .order('month', { ascending: true });

    if (error) throw error;
    
    // Ensure we have data for all 12 months
    const result = data as RevenueData[];
    const monthlyData = Array(12).fill(null).map((_, idx) => {
      const month = idx + 1;
      const existing = result.find(r => r.month === month);
      return existing || null;
    });
    
    return monthlyData;
  } catch (error) {
    console.error('Error fetching revenue history:', error);
    return Array(12).fill(null);
  }
}

// Create or update revenue data
export async function updateRevenueData(month: number, year: number, amount: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data: existing } = await supabase
      .from('revenue_history')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (existing) {
      const { data, error } = await supabase
        .from('revenue_history')
        .update({ amount })
        .eq('id', existing.id)
        .select();
        
      if (error) throw error;
      return data?.[0] as RevenueData;
    } else {
      const { data, error } = await supabase
        .from('revenue_history')
        .insert([{ month, year, amount, user_id: user.id }])
        .select();
        
      if (error) throw error;
      return data?.[0] as RevenueData;
    }
  } catch (error) {
    console.error('Error updating revenue data:', error);
    return null;
  }
}

// Get project progress data
export async function getProjectProgress(projectId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('project_progress')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('year', { ascending: true })
      .order('week_number', { ascending: true });

    if (error) throw error;
    return data as ProjectProgressData[];
  } catch (error) {
    console.error('Error fetching project progress:', error);
    return [];
  }
}

// Update dashboard stats
export async function updateDashboardStats(stats: Partial<DashboardStats>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data: existing } = await supabase
      .from('dashboard_stats')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();
    
    if (existing) {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .update({ ...stats, last_updated: new Date().toISOString() })
        .eq('id', existing.id)
        .select();
      
      if (error) throw error;
      return data?.[0] as DashboardStats;
    } else {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .insert([{ 
          ...stats, 
          user_id: user.id, 
          last_updated: new Date().toISOString() 
        }])
        .select();
      
      if (error) throw error;
      return data?.[0] as DashboardStats;
    }
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    return null;
  }
}
