
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Payment {
  id: string;
  client_name: string;
  invoice_number: string;
  amount: number;
  issue_date: string;
  due_date: string | null;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  description?: string | null;
  project_id?: string;
  created_at: string;
  updated_at: string;
  project_name?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidAmount: number;
  recentPayments: Payment[];
}

export const getPayments = async (
  status?: string,
  page: number = 1,
  pageSize: number = 10,
  sortBy: string = 'due_date',
  sortOrder: 'asc' | 'desc' = 'desc',
  searchQuery?: string
): Promise<{ data: Payment[], count: number }> => {
  try {
    // Build the base query with proper joins
    let query = supabase
      .from('project_payments')
      .select(`
        *,
        projects:project_id (name, client_id, clients:client_id (name))
      `);
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Apply search if provided
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`
        description.ilike.%${searchQuery}%,
        invoice_number.ilike.%${searchQuery}%
      `);
    }
    
    // Get the total count first
    const countQuery = supabase
      .from('project_payments')
      .select('id', { count: 'exact' });
      
    if (status && status !== 'all') {
      countQuery.eq('status', status);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      countQuery.or(`
        description.ilike.%${searchQuery}%,
        invoice_number.ilike.%${searchQuery}%
      `);
    }
    
    const { count, error: countError } = await countQuery;
    
    if (countError) throw countError;
    
    // Then get the actual data with pagination
    const { data, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) throw error;
    
    if (!data) {
      return { data: [], count: count || 0 };
    }
    
    // Transform data to match Payment interface
    const payments = data.map((item: any) => ({
      id: item.id,
      client_name: item.projects?.clients?.name || 'Unknown Client',
      project_name: item.projects?.name || 'Unknown Project',
      invoice_number: item.invoice_number || `INV-${item.id.substring(0, 6)}`,
      project_id: item.project_id,
      amount: Number(item.amount),
      issue_date: item.created_at,
      due_date: item.due_date,
      status: item.status,
      description: item.description,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return { data: payments, count: count || 0 };
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    toast.error(`Failed to load payments: ${error.message || 'Unknown error'}`);
    return { data: [], count: 0 };
  }
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
  try {
    const { data, error } = await supabase
      .from('project_payments')
      .select(`
        *,
        projects:project_id (name, client_id, clients:client_id (name))
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) {
      return {
        totalRevenue: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        recentPayments: []
      };
    }
    
    // Transform data
    const payments = data.map((item: any) => ({
      id: item.id,
      client_name: item.projects?.clients?.name || 'Unknown Client',
      project_name: item.projects?.name || 'Unknown Project',
      invoice_number: item.invoice_number || `INV-${item.id.substring(0, 6)}`,
      amount: Number(item.amount),
      issue_date: item.created_at,
      due_date: item.due_date,
      status: item.status,
      description: item.description,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    // Calculate stats
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    
    // Get recent payments (last 5)
    const recentPayments = payments.slice(0, 5);
    
    return {
      totalRevenue,
      paidAmount,
      pendingAmount,
      overdueAmount,
      recentPayments
    };
  } catch (error: any) {
    console.error('Error fetching payment stats:', error);
    toast.error(`Failed to load payment statistics: ${error.message || 'Unknown error'}`);
    return {
      totalRevenue: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      recentPayments: []
    };
  }
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'invoice_number'>): Promise<Payment | null> => {
  try {
    if (!payment.project_id) {
      throw new Error("Project ID is required");
    }

    // Ensure data types are correct before sending to Supabase
    const paymentData = {
      project_id: payment.project_id,
      amount: Number(payment.amount),
      due_date: payment.due_date,
      status: payment.status || 'pending',
      description: payment.description || null
    };
    
    const { data, error } = await supabase
      .from('project_payments')
      .insert(paymentData)
      .select(`
        *,
        projects:project_id (name, client_id, clients:client_id (name))
      `)
      .single();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from insert operation");
    }
    
    toast.success('Payment record created successfully');
    
    // Transform to Payment interface
    return {
      id: data.id,
      client_name: data.projects?.clients?.name || 'Unknown Client',
      project_name: data.projects?.name || 'Unknown Project',
      invoice_number: data.invoice_number || `INV-${data.id.substring(0, 6)}`,
      project_id: data.project_id,
      amount: Number(data.amount),
      issue_date: data.created_at,
      due_date: data.due_date,
      status: data.status as 'paid' | 'pending' | 'overdue' | 'cancelled',
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error creating payment:', error);
    toast.error(`Failed to create payment record: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const updatePayment = async (id: string, updates: Partial<Payment>): Promise<Payment | null> => {
  try {
    // Extract only updateable fields to prevent unintended changes
    const updateData: Record<string, any> = {};
    if (updates.project_id) updateData.project_id = updates.project_id;
    if (updates.amount !== undefined) updateData.amount = Number(updates.amount);
    if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
    if (updates.status) updateData.status = updates.status;
    if (updates.description !== undefined) updateData.description = updates.description;
    
    const { data, error } = await supabase
      .from('project_payments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        projects:project_id (name, client_id, clients:client_id (name))
      `)
      .single();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from update operation");
    }
    
    toast.success('Payment record updated successfully');
    
    // Transform to Payment interface
    return {
      id: data.id,
      client_name: data.projects?.clients?.name || 'Unknown Client',
      project_name: data.projects?.name || 'Unknown Project',
      invoice_number: data.invoice_number || `INV-${data.id.substring(0, 6)}`,
      project_id: data.project_id,
      amount: Number(data.amount),
      issue_date: data.created_at,
      due_date: data.due_date,
      status: data.status as 'paid' | 'pending' | 'overdue' | 'cancelled',
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error updating payment:', error);
    toast.error(`Failed to update payment record: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const deletePayment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Payment record deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    toast.error(`Failed to delete payment record: ${error.message || 'Unknown error'}`);
    return false;
  }
};

export const getProjects = async (): Promise<{ id: string, name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    toast.error(`Failed to load projects: ${error.message || 'Unknown error'}`);
    return [];
  }
};

export const getPaymentById = async (id: string): Promise<Payment | null> => {
  try {
    const { data, error } = await supabase
      .from('project_payments')
      .select(`
        *,
        projects:project_id (name, client_id, clients:client_id (name))
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return null;
    }
    
    // Transform to Payment interface
    return {
      id: data.id,
      client_name: data.projects?.clients?.name || 'Unknown Client',
      project_name: data.projects?.name || 'Unknown Project',
      invoice_number: data.invoice_number || `INV-${data.id.substring(0, 6)}`,
      project_id: data.project_id,
      amount: Number(data.amount),
      issue_date: data.created_at,
      due_date: data.due_date,
      status: data.status as 'paid' | 'pending' | 'overdue' | 'cancelled',
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error fetching payment by ID:', error);
    toast.error(`Failed to load payment details: ${error.message || 'Unknown error'}`);
    return null;
  }
};
