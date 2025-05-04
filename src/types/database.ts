
export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
  };
  identities: [
    {
      id: string;
      user_id: string;
      identity_data: {
        avatar_url: string;
        email: string;
        email_verified: boolean;
        full_name: string;
        iss: string;
        name: string;
        phone_verified: boolean;
        picture: string;
        provider_id: string;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string;
      created_at: string;
      updated_at: string;
    }
  ];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  industry: string | null;
  contact_name: string | null;
  contact_position: string | null;
  status: 'active' | 'inactive' | 'lead';
  auth_user_id: string | null;
  has_portal_access: boolean | null;
  temp_password: string | null;
  projects?: Project[];
}

export interface Project {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  client_id: string | null;
  deadline: string | null;
  category: string | null;
  status: 'pending' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  progress: number;
  notes: string | null;
  start_date: string | null;
  budget: number | null;
  priority: 'low' | 'medium' | 'high';
  tags: string[] | null;
  manager_notes: string | null;
  banner_url: string | null;
  client?: Client;
  project_team?: ProjectTeam[];
  team?: TeamMember[];
  teamCount?: number;
}

export interface ProjectTeam {
  id: string;
  created_at: string;
  project_id: string;
  team_member_id: string;
  role: string;
  team_members?: TeamMember;
}

export interface ClientInvitation {
  id: string;
  project_id: string;
  client_id: string | null;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  role: string;
  created_at: string;
  expires_at: string;
  invited_by: string | null;
}

export interface ClientAccess {
  id: string;
  client_id: string;
  project_id: string;
  access_level: 'view' | 'comment' | 'edit';
  created_at: string;
  updated_at: string;
  last_access: string | null;
  clients?: Client;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  project_role?: string;
  email?: string;
  phone?: string;
  status?: string;
  location?: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
}