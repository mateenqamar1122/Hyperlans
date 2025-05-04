
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectPayment {
  id: string;
  project_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  payment_date: string | null;
  due_date: string | null;
  description: string | null;
  invoice_number: string;
  created_at: string;
  updated_at: string;
}

export const getProjectPayments = async (projectId: string): Promise<ProjectPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching project payments:', error);
      throw error;
    }
    
    return data as ProjectPayment[];
  } catch (error: any) {
    console.error('Error fetching project payments:', error);
    toast.error(`Failed to load project payments: ${error.message || 'Unknown error'}`);
    return [];
  }
};

export const createProjectPayment = async (
  payment: Omit<ProjectPayment, 'id' | 'created_at' | 'updated_at' | 'invoice_number'>
): Promise<ProjectPayment | null> => {
  try {
    // Ensure data types are correct before sending to Supabase
    const paymentData = {
      project_id: payment.project_id,
      amount: Number(payment.amount),
      status: payment.status || 'pending',
      due_date: payment.due_date,
      payment_date: payment.payment_date,
      description: payment.description || null
    };
    
    const { data, error } = await supabase
      .from('project_payments')
      .insert([paymentData])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    toast.success('Payment record added successfully');
    return data as ProjectPayment;
  } catch (error: any) {
    console.error('Error creating payment record:', error);
    toast.error(`Failed to add payment record: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const updateProjectPayment = async (id: string, updates: Partial<ProjectPayment>): Promise<ProjectPayment | null> => {
  try {
    // Ensure data types are correct before sending to Supabase
    const updateData: Record<string, any> = {};
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.amount !== undefined) updateData.amount = Number(updates.amount);
    if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
    if (updates.payment_date !== undefined) updateData.payment_date = updates.payment_date;
    if (updates.description !== undefined) updateData.description = updates.description;
    
    const { data, error } = await supabase
      .from('project_payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    toast.success('Payment record updated successfully');
    return data as ProjectPayment;
  } catch (error: any) {
    console.error('Error updating payment record:', error);
    toast.error(`Failed to update payment record: ${error.message || 'Unknown error'}`);
    return null;
  }
};

export const deleteProjectPayment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Payment record deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting payment record:', error);
    toast.error(`Failed to delete payment record: ${error.message || 'Unknown error'}`);
    return false;
  }
};

// Get a single payment by ID
export const getProjectPayment = async (id: string): Promise<ProjectPayment | null> => {
  try {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    
    return data as ProjectPayment;
  } catch (error: any) {
    console.error('Error fetching payment record:', error);
    toast.error(`Failed to load payment details: ${error.message || 'Unknown error'}`);
    return null;
  }
};
