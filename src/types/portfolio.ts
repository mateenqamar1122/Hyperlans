
export interface Portfolio {
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
  published_url?: string;
  is_published?: boolean;
  contact: PortfolioContact;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioContact {
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface Skill {
  id?: string;
  portfolio_id?: string;
  name: string;
  level: number;
  category: string;
  created_at?: string;
}

export interface Experience {
  id?: string;
  portfolio_id?: string;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  description?: string;
  created_at?: string;
}

export interface PortfolioProject {
  id?: string;
  portfolio_id?: string;
  title: string;
  description?: string;
  client: string;
  image_url?: string;
  tags?: string[];
  technologies?: string[];
  featured?: boolean;
  url?: string;
  github_url?: string;
  type?: string;
  status?: string;
  start_date?: string;
  completion_date?: string;
  testimonial?: string;
  features?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioService {
  id?: string;
  portfolio_id?: string;
  title: string;
  description: string;
  price?: string;
  icon?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExtendedPortfolioData extends Portfolio {
  projects: PortfolioProject[];
  skills: Skill[];
  experiences: Experience[];
  services: PortfolioService[];
  logoImage: string;
  bannerImage: string;
}
