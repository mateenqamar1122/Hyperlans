
export interface PortfolioContact {
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  }
  
  export interface Skill {
    id?: string;
    name: string;
    level: number;
    category: string;
  }
  
  export interface PortfolioProject {
    id?: string;
    title: string;
    description?: string;
    technologies?: string[];
    image?: string;
    link?: string;
    featured?: boolean;
  }
  
  export interface PortfolioExperience {
    id?: string;
    role: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
    achievements?: string[];
  }
  
  export interface ExtendedPortfolioData {
    id?: string;
    user_id?: string;
    name: string;
    title: string;
    subtitle?: string;
    bio: string;
    theme: string;
    layout: string;
    logoImage?: string;
    bannerImage?: string;
    contact: PortfolioContact;
    skills: Skill[];
    projects: PortfolioProject[];
    experiences: PortfolioExperience[];
  }
  
  export interface DbPortfolioData {
    id: string;
    user_id: string;
    name: string;
    title: string;
    subtitle?: string;
    bio: string;
    theme: string;
    layout: string;
    logo_url?: string;
    banner_url?: string;
    created_at: string;
    updated_at: string;
    is_published: boolean;
    published_url?: string;
    contact: PortfolioContact;
  }
  
  export interface DbPortfolioContact {
    id: string;
    portfolio_id: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  }
  
  export interface DbPortfolioProject {
    id: string;
    portfolio_id: string;
    title: string;
    description?: string;
    technologies?: string[];
    image_url?: string;
    url?: string;
    is_featured: boolean;
  }
  
  export interface DbPortfolioExperience {
    id: string;
    portfolio_id: string;
    title: string;
    company: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description?: string;
  }
  
  export interface DbPortfolioSkill {
    id: string;
    portfolio_id: string;
    name: string;
    level: number;
    category: string;
  }
  
  export interface DbPortfolioService {
    id: string;
    portfolio_id: string;
    title: string;
    description: string;
    price?: string;
    icon?: string;
  }
  
  export interface DbPortfolioTestimonial {
    id: string;
    portfolio_id: string;
    name: string;
    company?: string;
    content: string;
    avatar_url?: string;
    rating?: number;
  }
  
  export interface DbPortfolioTeamMember {
    id: string;
    portfolio_id: string;
    name: string;
    role: string;
    bio?: string;
    email?: string;
    avatar_url?: string;
    socialLinks?: DbPortfolioTeamMemberSocialLink[];
  }
  
  export interface DbPortfolioSocialLink {
    id: string;
    portfolio_id: string;
    platform: string;
    url: string;
    icon?: string;
  }
  
  export interface DbPortfolioTeamMemberSocialLink {
    id: string;
    team_member_id: string;
    platform: string;
    url: string;
    icon?: string;
  }
  
  export interface TeamMember {
    id?: string;
    name: string;
    role: string;
    bio?: string;
    email?: string;
    avatarUrl?: string;
    socialLinks?: SocialLink[];
  }
  
  export interface SocialLink {
    id?: string;
    platform: string;
    url: string;
    icon?: string;
  }