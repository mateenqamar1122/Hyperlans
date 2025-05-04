export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
  featured: boolean;
  portfolio_id?: string; // Adding this property to match DbPortfolioProject
  client: string; // Add this required field
}


export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements: string[];
}

export interface PortfolioData {
  id?: string;
  user_id?: string;
  name: string;
  title: string; // This is required in ExtendedPortfolioData
  subtitle?: string;
  bio: string;
  theme: string;
  layout: string;
  logoImage?: string;
  bannerImage?: string;
  contact: {
    id?: string;
    portfolio_id?: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  projects: PortfolioProject[];
  experiences: Experience[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price?: string;
  icon?: string;
}

export interface Testimonial {
  role: any;
  author: any;
  id: string;
  name: string;
  company?: string;
  content: string;
  avatarUrl?: string;
  rating: number;
}

export interface Skill {
  id?: string;
  name: string;
  level: number; // 1-100
  category?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  icon?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  socialLinks?: SocialLink[];
}

export interface ExtendedPortfolioData extends PortfolioData {
  services?: Service[];
  testimonials?: Testimonial[];
  skills?: Skill[];
  education?: EducationItem[];
  socialLinks?: SocialLink[];
  showCaseStudies?: boolean;
  allowClientFeedback?: boolean;
  showAvailability?: boolean;
  availabilityCalendarUrl?: string;
  caseStudies?: CaseStudy[];
  teamMembers?: TeamMember[];
  logoImage?: string;
  bannerImage?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  images: string[];
  technologies: string[];
  client: string;
  date: string;
}

// Database response types
export interface DbPortfolioData {
  id: string;
  user_id?: string;
  name: string;
  title: string;
  subtitle?: string;
  bio: string;
  theme: string;
  layout: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface DbPortfolioProject {
  id: string;
  portfolio_id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url?: string;
  link?: string;
  featured: boolean; // This is required based on the error
  created_at: string;
  updated_at: string;
  // Fields matching the database structure
  client?: string;
  type?: string;
  status?: string;
  start_date?: string;
  completion_date?: string;
  github_url?: string;
  url?: string;
  
  is_featured?: boolean;
}

export interface DbPortfolioExperience {
  id: string;
  portfolio_id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements: string[];
  created_at: string;
  updated_at: string;
}

export interface DbPortfolioSkill {
  id: string;
  portfolio_id: string;
  name: string;
  level: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface DbPortfolioService {
  id: string;
  portfolio_id: string;
  title: string;
  description: string;
  price?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface DbPortfolioTestimonial {
  id: string;
  portfolio_id: string;
  name: string;
  company?: string;
  content: string;
  avatar_url?: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface DbPortfolioTeamMember {
  id: string;
  portfolio_id: string;
  name: string;
  role: string;
  bio?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DbPortfolioSocialLink {
  id: string;
  portfolio_id: string;
  platform: string;
  url: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface DbPortfolioTeamMemberSocialLink {
  id: string;
  team_member_id: string;
  platform: string;
  url: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}