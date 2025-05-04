
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClientAccess } from "@/types/database";

export const grantClientAccess = async (
  clientId: string,
  projectId: string,
  accessLevel: ClientAccess['access_level'] = 'view'
): Promise<ClientAccess | null> => {
  try {
    const { data, error } = await supabase
      .from('client_access')
      .insert({
        client_id: clientId,
        project_id: projectId,
        access_level: accessLevel,
      })
      .select()
      .single();

    if (error) throw error;

    // Send email notification
    const { data: clientData } = await supabase
      .from('clients')
      .select('email, name')
      .eq('id', clientId)
      .single();

    const { data: projectData } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single();

    if (clientData?.email) {
      const { error: emailError } = await supabase.functions.invoke('send-emails', {
        body: {
          to: clientData.email,
          subject: 'Project Access Granted',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">You've been granted access to a project</h1>
              <p style="color: #555; font-size: 16px;">Hello ${clientData.name},</p>
              <p style="color: #555; font-size: 16px;">You now have <strong>${accessLevel}</strong> access to the project: <strong>${projectData?.name || 'Project'}</strong>.</p>
              <p style="color: #555; font-size: 16px;">You can access the project by logging into your client portal.</p>
            </div>
          `,
        },
      });

      if (emailError) {
        console.error('Error sending access notification email:', emailError);
        // We don't fail the operation if just the email fails
        toast.info('Client access granted, but notification email could not be sent');
      }
    }

    toast.success('Client access granted successfully');
    return data as ClientAccess;
  } catch (error) {
    console.error('Error granting client access:', error);
    toast.error('Failed to grant client access');
    return null;
  }
};

export const updateClientAccess = async (
  id: string,
  updates: Partial<ClientAccess>
): Promise<ClientAccess | null> => {
  try {
    const { data, error } = await supabase
      .from('client_access')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Client access updated successfully');
    return data as ClientAccess;
  } catch (error) {
    console.error('Error updating client access:', error);
    toast.error('Failed to update client access');
    return null;
  }
};

export const getClientAccess = async (projectId: string): Promise<ClientAccess[]> => {
  try {
    const { data, error } = await supabase
      .from('client_access')
      .select('*, clients(*)')
      .eq('project_id', projectId);

    if (error) throw error;
    return data as ClientAccess[];
  } catch (error) {
    console.error('Error fetching client access:', error);
    toast.error('Failed to load client access');
    return [];
  }
};
