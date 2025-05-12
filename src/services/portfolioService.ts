
import { supabase } from "@/integrations/supabase/client";
import { Portfolio, ExtendedPortfolioData } from "@/types/portfolio";
import { getPortfolioSkills } from "./portfolioSkillsService";
import { getPortfolioProjects } from "./portfolioProjectsService";
import { getPortfolioExperiences } from "./portfolioExperiencesService";
import { getPortfolioServices } from "./portfolioServicesService";

// Default portfolio data
const defaultPortfolio: Omit<Portfolio, 'id' | 'user_id'> = {
  name: "Professional Portfolio",
  title: "Professional Developer",
  subtitle: "Building digital solutions for modern businesses",
  bio: "I am a skilled professional with expertise in development, design, and problem-solving. With years of experience in the industry, I help businesses transform their ideas into reality.",
  theme: "modern",
  layout: "professional",
  contact: {
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    twitter: "",
    github: ""
  }
};

export const getPortfolio = async (): Promise<Portfolio | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching portfolio:", error);
      return null;
    }

    // If no portfolio exists, create one with default data
    if (!data) {
      return createPortfolio();
    }

    return data;
  } catch (error) {
    console.error("Error in getPortfolio:", error);
    return null;
  }
};

export const createPortfolio = async (): Promise<Portfolio | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const newPortfolio = {
      ...defaultPortfolio,
      user_id: userData.user.id
    };

    const { data, error } = await supabase
      .from("portfolios")
      .insert(newPortfolio)
      .select('*')
      .single();

    if (error) {
      console.error("Error creating portfolio:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createPortfolio:", error);
    return null;
  }
};

export const updatePortfolio = async (portfolio: Partial<Portfolio>): Promise<Portfolio | null> => {
  try {
    if (!portfolio.id) {
      console.error("Portfolio ID is required for update");
      return null;
    }

    const { data, error } = await supabase
      .from("portfolios")
      .update(portfolio)
      .eq("id", portfolio.id)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating portfolio:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in updatePortfolio:", error);
    return null;
  }
};

export const publishPortfolio = async (portfolioId: string): Promise<boolean> => {
  try {
    // Generate a unique slug for the published URL
    const publishedUrl = `portfolio-${Date.now().toString(36)}`;
    
    const { error } = await supabase
      .from("portfolios")
      .update({ 
        is_published: true,
        published_url: publishedUrl
      })
      .eq("id", portfolioId);

    if (error) {
      console.error("Error publishing portfolio:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in publishPortfolio:", error);
    return false;
  }
};

export const getExtendedPortfolioData = async (): Promise<ExtendedPortfolioData | null> => {
  try {
    const { data: portfolioData, error: portfolioError } = await supabase
      .from("portfolios")
      .select("*")
      .single();

    if (portfolioError) {
      if (portfolioError.code !== "PGRST116") { // Not found error
        console.error("Error fetching portfolio:", portfolioError);
      }
      return null;
    }

    if (!portfolioData) {
      return null;
    }

    const portfolio = portfolioData as Portfolio;
    const skills = await getPortfolioSkills(portfolio.id);
    const projects = await getPortfolioProjects(portfolio.id);
    const experiences = await getPortfolioExperiences(portfolio.id);
    const services = await getPortfolioServices(portfolio.id);

    const extendedPortfolio: ExtendedPortfolioData = {
      ...portfolio,
      projects,
      skills,
      experiences,
      services,
      logoImage: portfolio.logo_url || "",
      bannerImage: portfolio.banner_url || ""
    };

    return extendedPortfolio;
  } catch (error) {
    console.error("Error fetching extended portfolio data:", error);
    return null;
  }
};
