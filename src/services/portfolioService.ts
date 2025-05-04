
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ExtendedPortfolioData, Skill, PortfolioProject, PortfolioExperience } from "@/types/portfolio";

export const uploadPortfolioImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `portfolio_images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload image");
    return null;
  }
};

// Save portfolio data to Supabase
export const savePortfolioData = async (portfolio: ExtendedPortfolioData): Promise<string | null> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast.error("You must be logged in to save a portfolio");
      return null;
    }

    // First save the main portfolio data
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .upsert({
        id: portfolio.id || undefined,
        user_id: user.id,
        name: portfolio.name,
        title: portfolio.title,
        subtitle: portfolio.subtitle || '',
        bio: portfolio.bio,
        theme: portfolio.theme || 'default',
        layout: portfolio.layout || 'standard',
        logo_url: portfolio.logoImage || null,
        banner_url: portfolio.bannerImage || null,
        contact: portfolio.contact || {},
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (portfolioError) throw portfolioError;
    
    const portfolioId = portfolioData.id;
    
    // Save portfolio skills
    if (portfolio.skills && portfolio.skills.length > 0) {
      // Get current skills to determine which ones to delete
      const { data: existingSkills } = await supabase
        .from('portfolio_skills')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingSkills?.map((s: any) => s.id) || [];
      const newSkillIds = portfolio.skills.map(s => s.id).filter(id => id);
      const skillsToDelete = existingIds.filter(id => !newSkillIds.includes(id));
      
      // Delete removed skills
      if (skillsToDelete.length > 0) {
        await supabase
          .from('portfolio_skills')
          .delete()
          .in('id', skillsToDelete);
      }
      
      // Upsert (update or insert) skills
      for (const skill of portfolio.skills) {
        await supabase
          .from('portfolio_skills')
          .upsert({
            id: skill.id || undefined,
            portfolio_id: portfolioId,
            name: skill.name,
            level: skill.level,
            category: skill.category
          });
      }
    }
    
    // Save portfolio projects
    if (portfolio.projects && portfolio.projects.length > 0) {
      // For projects, we don't delete existing ones, just update the portfolio_id reference
      for (const project of portfolio.projects) {
        await supabase
          .from('portfolio_projects')
          .upsert({
            id: project.id,
            portfolio_id: portfolioId,
            title: project.title,
            description: project.description,
            image_url: project.image,
            url: project.link,
            technologies: project.technologies,
            is_featured: project.featured
          });
      }
    }
    
    // Save portfolio experiences
    if (portfolio.experiences && portfolio.experiences.length > 0) {
      // Get current experiences to determine which ones to delete
      const { data: existingExperiences } = await supabase
        .from('portfolio_experiences')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingExperiences?.map((e: any) => e.id) || [];
      const newExpIds = portfolio.experiences.map(e => e.id).filter(id => id);
      const experiencesToDelete = existingIds.filter(id => !newExpIds.includes(id));
      
      // Delete removed experiences
      if (experiencesToDelete.length > 0) {
        await supabase
          .from('portfolio_experiences')
          .delete()
          .in('id', experiencesToDelete);
      }
      
      // Upsert experiences
      for (const exp of portfolio.experiences) {
        await supabase
          .from('portfolio_experiences')
          .upsert({
            id: exp.id || undefined,
            portfolio_id: portfolioId,
            title: exp.role,
            company: exp.company,
            location: exp.location,
            start_date: exp.startDate,
            end_date: exp.endDate,
            current: exp.isCurrent,
            description: exp.description
          });
      }
    }

    toast.success("Portfolio saved successfully");
    return portfolioId;
  } catch (error) {
    console.error("Error saving portfolio:", error);
    toast.error("Failed to save portfolio");
    return null;
  }
};

// Get a portfolio by ID
export const getPortfolioById = async (portfolioId: string): Promise<ExtendedPortfolioData | null> => {
  try {
    // Get the main portfolio data
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();
    
    if (portfolioError) throw portfolioError;
    
    // Get skills
    const { data: skillsData } = await supabase
      .from('portfolio_skills')
      .select('*')
      .eq('portfolio_id', portfolioId);
    
    // Get projects
    const { data: projectsData } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('portfolio_id', portfolioId);
    
    // Get experiences
    const { data: experiencesData } = await supabase
      .from('portfolio_experiences')
      .select('*')
      .eq('portfolio_id', portfolioId);
    
    // Map the data to the portfolio structure
    const portfolio: ExtendedPortfolioData = {
      id: portfolioData.id,
      user_id: portfolioData.user_id,
      name: portfolioData.name,
      title: portfolioData.title,
      subtitle: portfolioData.subtitle,
      bio: portfolioData.bio,
      theme: portfolioData.theme,
      layout: portfolioData.layout,
      logoImage: portfolioData.logo_url,
      bannerImage: portfolioData.banner_url,
      contact: portfolioData.contact,
      skills: skillsData?.map((s: any) => ({
        id: s.id,
        name: s.name,
        level: s.level,
        category: s.category
      })) || [],
      projects: projectsData?.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image_url,
        link: p.url,
        technologies: p.technologies,
        featured: p.is_featured
      })) || [],
      experiences: experiencesData?.map((e: any) => ({
        id: e.id,
        role: e.title,
        company: e.company,
        location: e.location,
        startDate: e.start_date,
        endDate: e.end_date,
        isCurrent: e.current,
        description: e.description
      })) || []
    };
    
    return portfolio;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    toast.error("Failed to load portfolio");
    return null;
  }
};

// Get all portfolios for the current user
export const getUserPortfolios = async (): Promise<ExtendedPortfolioData[]> => {
  try {
    const { data: userPortfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return userPortfolios.map((p: any) => ({
      id: p.id,
      user_id: p.user_id,
      name: p.name,
      title: p.title,
      subtitle: p.subtitle,
      bio: p.bio,
      theme: p.theme,
      layout: p.layout,
      logoImage: p.logo_url,
      bannerImage: p.banner_url,
      contact: p.contact,
      skills: [],
      projects: [],
      experiences: []
    }));
  } catch (error) {
    console.error("Error fetching user portfolios:", error);
    toast.error("Failed to load portfolios");
    return [];
  }
};

// Delete a portfolio
export const deletePortfolio = async (portfolioId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId);
    
    if (error) throw error;
    
    toast.success("Portfolio deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    toast.error("Failed to delete portfolio");
    return false;
  }
};

// Export portfolio as PDF or HTML
export const exportPortfolioToPDF = async (portfolioId?: string): Promise<void> => {
  try {
    let portfolio: ExtendedPortfolioData | null = null;
    
    if (portfolioId) {
      // If portfolioId is provided, fetch the portfolio data
      portfolio = await getPortfolioById(portfolioId);
    } else {
      // Otherwise, try to get the current user's first portfolio
      const portfolios = await getUserPortfolios();
      if (portfolios.length > 0) {
        portfolio = await getPortfolioById(portfolios[0].id);
      }
    }
    
    if (!portfolio) {
      toast.error("No portfolio found to export");
      return;
    }
    
    // Import the exportPortfolio function from pdfExportService
    const { exportPortfolio } = await import('./pdfExportService');
    
    // Export the portfolio to PDF
    await exportPortfolio(portfolio, {
      filename: `${portfolio.name.replace(/\s+/g, '_')}_portfolio.pdf`,
      watermark: 'Created with ProFlo'
    });
    
  } catch (error) {
    console.error("Error exporting portfolio to PDF:", error);
    toast.error("Failed to export portfolio to PDF");
  }
};

// Share portfolio via link
export const sharePortfolio = async (portfolioName?: string): Promise<void> => {
  // Generate a shareable link
  toast.info("Sharing functionality coming soon");
};