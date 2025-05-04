
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/database";
import { toast } from "sonner";

export async function getClientCount() {
  try {
    const { count, error } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching client count:", error);
    return 0;
  }
}

export const getClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Convert the data to match the Client type
    return data.map(client => ({
      ...client,
      // Ensure projects property is an array to match the Client type
      projects: client.projects || []
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    toast.error('Failed to load clients');
    return [];
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*, projects(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching client:', error);
    toast.error('Failed to load client details');
    return null;
  }
};

export const createClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...client,
        auth_user_id: null,
        has_portal_access: client.temp_password ? true : false
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Client created successfully');
    return data;
  } catch (error) {
    console.error('Error creating client:', error);
    toast.error('Failed to create client');
    return null;
  }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Client updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating client:', error);
    toast.error('Failed to update client');
    return null;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Client deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    toast.error('Failed to delete client');
    return false;
  }
};
