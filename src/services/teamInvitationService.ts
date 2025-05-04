
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { TeamMember } from "@/types/database";

export const sendTeamMemberInvitation = async (
  email: string,
  projectId?: string,
  role?: string
): Promise<boolean> => {
  try {
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');
    
    const invitationToken = uuidv4();
    
    // Get project details if a project ID was provided
    let projectName = "";
    if (projectId) {
      const { data: projectData } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();
      
      projectName = projectData?.name || "a project";
    }
    
    // Send email with enhanced error handling
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-emails', {
      body: {
        to: email,
        subject: `Team Invitation${projectId ? `: ${projectName}` : ''}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">You've been invited to join the team</h1>
            <p style="color: #555; font-size: 16px;">You have been invited to collaborate ${projectId ? `on project: <strong>${projectName}</strong>` : 'with the team'}.</p>
            ${role ? `<p style="color: #555; font-size: 16px;">Your role will be: <strong>${role}</strong></p>` : ''}
            <p style="color: #555; font-size: 16px;">Click the button below to accept the invitation:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/accept-team-invitation?token=${invitationToken}" 
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
      console.error('Error sending team invitation email:', emailError);
      
      // Handle domain verification issues specifically
      if (emailError.message?.includes('domain') && emailError.message?.includes('not verified')) {
        toast.error('Team invitation could not be sent due to email domain verification issues');
        toast.info('Please check your email configuration or contact them directly');
      } else {
        toast.error('Failed to send team invitation');
      }
      
      return false;
    }
    
    toast.success('Team invitation sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending team invitation:', error);
    toast.error('Failed to send team invitation');
    return false;
  }
};

export const addTeamMemberToProject = async (
  teamMemberId: string,
  projectId: string,
  projectRole: string = 'team_member'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_team')
      .insert({
        team_member_id: teamMemberId,
        project_id: projectId,
        role: projectRole
      });

    if (error) throw error;
    
    // Get team member details
    const { data: memberData } = await supabase
      .from('team_members')
      .select('email, name')
      .eq('id', teamMemberId)
      .single();
    
    if (memberData?.email) {
      // Get project details
      const { data: projectData } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();
      
      // Send notification email with better error handling
      const { error: emailError } = await supabase.functions.invoke('send-emails', {
        body: {
          to: memberData.email,
          subject: 'You have been added to a project',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Project Assignment</h1>
              <p style="color: #555; font-size: 16px;">You have been assigned to the project: <strong>${projectData?.name || 'New Project'}</strong></p>
              <p style="color: #555; font-size: 16px;">Your role: <strong>${projectRole}</strong></p>
              <p style="color: #555; font-size: 16px;">Login to see the details and start collaborating!</p>
            </div>
          `,
        },
      });
      
      if (emailError) {
        console.error('Error sending project assignment notification:', emailError);
        // We don't fail the operation if just the email fails
        toast.info('Team member added to project, but notification email could not be sent');
      }
    }
    
    toast.success('Team member added to project successfully');
    return true;
  } catch (error) {
    console.error('Error adding team member to project:', error);
    toast.error('Failed to add team member to project');
    return false;
  }
};
