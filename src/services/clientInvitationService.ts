import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { ClientInvitation } from "@/types/database";

export const createClientInvitation = async (
  projectId: string,
  email: string,
  clientId: string
): Promise<ClientInvitation | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now

    const { data, error } = await supabase
      .from('client_invitations')
      .insert({
        project_id: projectId,
        email,
        client_id: clientId,
        token,
        invited_by: userData.user.id,
        expires_at: expiresAt,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Get project name for email
    const { data: projectData } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single();

    const projectName = projectData?.name || 'a project';

    // Send invitation email
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-emails', {
      body: {
        to: email,
        subject: `Project Invitation: ${projectName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">
              You've been invited to collaborate on a project
            </h1>
            <p style="color: #555; font-size: 16px;">
              You have been invited to collaborate on <strong>${projectName}</strong>.
            </p>
            <p style="color: #555; font-size: 16px;">
              Click the button below to accept the invitation:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/accept-invitation?token=${token}" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Accept Invitation
              </a>
            </div>
            <p style="color: #777; font-size: 14px;">This invitation will expire in 7 days.</p>
          </div>
        `,
      },
    });

    if (emailError) {
      console.error('Error sending invitation email:', emailError);

      if (emailError.message?.includes('domain') && emailError.message?.includes('not verified')) {
        toast.error('Invitation created but email could not be sent due to domain verification issues');
        toast.info('The client was added to the system, but you may need to contact them directly');
      } else {
        toast.error('Invitation created but email could not be sent');
      }

      return data as ClientInvitation;
    }

    toast.success('Client invitation sent successfully');
    return data as ClientInvitation;
  } catch (error) {
    console.error('Error creating client invitation:', error);
    toast.error('Failed to send client invitation');
    return null;
  }
};

export const getProjectInvitations = async (projectId: string): Promise<ClientInvitation[]> => {
  try {
    const { data, error } = await supabase
      .from('client_invitations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ClientInvitation[];
  } catch (error) {
    console.error('Error fetching project invitations:', error);
    toast.error('Failed to load invitations');
    return [];
  }
};

export const verifyInvitation = async (token: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('client_invitations')
      .select('*')
      .eq('token', token)
      .single();

    if (error) throw error;
    if (!data) return false;

    const isExpired = new Date(data.expires_at) < new Date();
    return !isExpired && data.status === 'pending';
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return false;
  }
};
