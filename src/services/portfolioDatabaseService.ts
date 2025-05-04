
import { supabase } from "@/integrations/supabase/client";
import { 
  ExtendedPortfolioData,
  DbPortfolioData,
  DbPortfolioContact,
  DbPortfolioProject,
  DbPortfolioExperience,
  DbPortfolioSkill,
  DbPortfolioService,
  DbPortfolioTestimonial,
  DbPortfolioTeamMember,
  DbPortfolioSocialLink,
  DbPortfolioTeamMemberSocialLink
} from "@/types/portfolio";
import { toast } from "sonner";

// Get all portfolio data for a user
export const getPortfolios = async (): Promise<DbPortfolioData[]> => {
  try {
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data, error } = await supabase
      .from('portfolio_data')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    toast.error('Failed to load portfolios');
    return [];
  }
};

// Get complete portfolio data by ID
export const getPortfolioById = async (id: string): Promise<ExtendedPortfolioData | null> => {
  try {
    // Get main portfolio data
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio_data')
      .select('*')
      .eq('id', id)
      .single();
    
    if (portfolioError) throw portfolioError;
    if (!portfolioData) return null;

    // Get contact information
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: contactData, error: contactError } = await supabase
      .from('portfolio_contact')
      .select('*')
      .eq('portfolio_id', id)
      .single();
    
    if (contactError && contactError.code !== 'PGRST116') throw contactError;

    // Get projects
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: projectsData, error: projectsError } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('portfolio_id', id);
    
    if (projectsError) throw projectsError;

    // Get experiences
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: experiencesData, error: experiencesError } = await supabase
      .from('portfolio_experiences')
      .select('*')
      .eq('portfolio_id', id);
    
    if (experiencesError) throw experiencesError;

    // Get skills
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: skillsData, error: skillsError } = await supabase
      .from('portfolio_skills')
      .select('*')
      .eq('portfolio_id', id);
    
    if (skillsError) throw skillsError;

    // Get services
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: servicesData, error: servicesError } = await supabase
      .from('portfolio_services')
      .select('*')
      .eq('portfolio_id', id);
    
    if (servicesError) throw servicesError;

    // Get testimonials
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from('portfolio_testimonials')
      .select('*')
      .eq('portfolio_id', id);
    
    if (testimonialsError) throw testimonialsError;

    // Get team members
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: teamMembersData, error: teamMembersError } = await supabase
      .from('portfolio_team_members')
      .select('*')
      .eq('portfolio_id', id);
    
    if (teamMembersError) throw teamMembersError;

    // Get social links
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: socialLinksData, error: socialLinksError } = await supabase
      .from('portfolio_social_links')
      .select('*')
      .eq('portfolio_id', id);
    
    if (socialLinksError) throw socialLinksError;

    // For each team member, get their social links
    const teamMembers = await Promise.all(teamMembersData.map(async (member) => {
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: memberSocialLinks, error: memberSocialLinksError } = await supabase
        .from('portfolio_team_member_social_links')
        .select('*')
        .eq('team_member_id', member.id);
      
      if (memberSocialLinksError) throw memberSocialLinksError;

      return {
        id: member.id,
        name: member.name,
        role: member.role,
        bio: member.bio,
        email: member.email,
        avatarUrl: member.avatar_url,
        socialLinks: memberSocialLinks.map((link: any) => ({
          id: link.id,
          platform: link.platform,
          url: link.url,
          icon: link.icon
        }))
      };
    }));

    // Build the complete portfolio data object
    const completePortfolio: ExtendedPortfolioData = {
      id: portfolioData.id,
      user_id: portfolioData.user_id,
      name: portfolioData.name,
      title: portfolioData.title,
      subtitle: portfolioData.subtitle,
      bio: portfolioData.bio,
      theme: portfolioData.theme,
      layout: portfolioData.layout,
      contact: contactData ? {
        id: contactData.id,
        portfolio_id: contactData.portfolio_id,
        email: contactData.email,
        phone: contactData.phone,
        location: contactData.location,
        linkedin: contactData.linkedin,
        github: contactData.github,
        website: contactData.website
      } : {
        email: "", // Default empty contact
      },
      projects: projectsData.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        image: project.image_url || "",
        link: project.url,
        featured: project.is_featured || false
      })),
      experiences: experiencesData.map((exp: any) => ({
        id: exp.id,
        company: exp.company,
        role: exp.role,
        duration: exp.duration,
        description: exp.description,
        achievements: exp.achievements
      })),
      skills: skillsData.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        category: skill.category
      })),
      services: servicesData.map((service: any) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        icon: service.icon
      })),
      testimonials: testimonialsData.map((testimonial: any) => ({
        id: testimonial.id,
        name: testimonial.name,
        company: testimonial.company,
        content: testimonial.content,
        avatarUrl: testimonial.avatar_url,
        rating: testimonial.rating
      })),
      teamMembers,
      socialLinks: socialLinksData.map((link: any) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        icon: link.icon
      }))
    };

    return completePortfolio;
  } catch (error) {
    console.error('Error fetching portfolio by ID:', error);
    toast.error('Failed to load portfolio details');
    return null;
  }
};

// Save complete portfolio data
export const saveCompletePortfolio = async (
  portfolioData: ExtendedPortfolioData
): Promise<string | null> => {
  try {
    // Required fields check
    if (!portfolioData.title) {
      throw new Error("Portfolio title is required");
    }

    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { data: mainData, error: mainError } = await supabase
      .from('portfolio_data')
      .upsert({
        id: portfolioData.id, // If existing, it will update
        user_id: portfolioData.user_id,
        name: portfolioData.name,
        title: portfolioData.title,
        subtitle: portfolioData.subtitle,
        bio: portfolioData.bio,
        theme: portfolioData.theme,
        layout: portfolioData.layout,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (mainError) throw mainError;
    const portfolioId = mainData.id;

    // Save contact information
    if (portfolioData.contact) {
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { error: contactError } = await supabase
        .from('portfolio_contact')
        .upsert({
          id: portfolioData.contact.id,
          portfolio_id: portfolioId,
          email: portfolioData.contact.email,
          phone: portfolioData.contact.phone,
          location: portfolioData.contact.location,
          linkedin: portfolioData.contact.linkedin,
          github: portfolioData.contact.github,
          website: portfolioData.contact.website,
          updated_at: new Date().toISOString()
        });
      
      if (contactError) throw contactError;
    }

    // Handle projects
    if (portfolioData.projects && portfolioData.projects.length > 0) {
      // Get existing projects to determine what to delete
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: existingProjects } = await supabase
        .from('portfolio_projects')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingProjects?.map(p => p.id) || [];
      const newIds = portfolioData.projects.map(p => p.id);
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      // Delete removed projects
      if (idsToDelete.length > 0) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: deleteError } = await supabase
          .from('portfolio_projects')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Upsert projects
      for (const project of portfolioData.projects) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: projectError } = await supabase
          .from('portfolio_projects')
          .upsert({
            id: project.id,
            portfolio_id: portfolioId,
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            image_url: project.image,
            url: project.link,
            is_featured: project.featured,
            updated_at: new Date().toISOString()
          });
        
        if (projectError) throw projectError;
      }
    }

    // Handle experiences
    if (portfolioData.experiences && portfolioData.experiences.length > 0) {
      // Get existing experiences to determine what to delete
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: existingExperiences } = await supabase
        .from('portfolio_experiences')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingExperiences?.map(p => p.id) || [];
      const newIds = portfolioData.experiences.map(p => p.id);
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      // Delete removed experiences
      if (idsToDelete.length > 0) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: deleteError } = await supabase
          .from('portfolio_experiences')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Upsert experiences
      for (const experience of portfolioData.experiences) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: expError } = await supabase
          .from('portfolio_experiences')
          .upsert({
            id: experience.id,
            portfolio_id: portfolioId,
            company: experience.company,
            role: experience.role,
            duration: experience.duration,
            description: experience.description,
            achievements: experience.achievements,
            updated_at: new Date().toISOString()
          });
        
        if (expError) throw expError;
      }
    }

    // Handle skills
    if (portfolioData.skills && portfolioData.skills.length > 0) {
      // Get existing skills to determine what to delete
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: existingSkills } = await supabase
        .from('portfolio_skills')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingSkills?.map(p => p.id) || [];
      const newIds = portfolioData.skills.map(p => p.id).filter(id => id);
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      // Delete removed skills
      if (idsToDelete.length > 0) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: deleteError } = await supabase
          .from('portfolio_skills')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Upsert skills
      for (const skill of portfolioData.skills) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: skillError } = await supabase
          .from('portfolio_skills')
          .upsert({
            id: skill.id,
            portfolio_id: portfolioId,
            name: skill.name,
            level: skill.level,
            category: skill.category,
            updated_at: new Date().toISOString()
          });
        
        if (skillError) throw skillError;
      }
    }

    // Handle services
    if (portfolioData.services && portfolioData.services.length > 0) {
      // Get existing services to determine what to delete
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: existingServices } = await supabase
        .from('portfolio_services')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingServices?.map(p => p.id) || [];
      const newIds = portfolioData.services.map(p => p.id);
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      // Delete removed services
      if (idsToDelete.length > 0) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: deleteError } = await supabase
          .from('portfolio_services')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Upsert services
      for (const service of portfolioData.services) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: serviceError } = await supabase
          .from('portfolio_services')
          .upsert({
            id: service.id,
            portfolio_id: portfolioId,
            title: service.title,
            description: service.description,
            price: service.price,
            icon: service.icon,
            updated_at: new Date().toISOString()
          });
        
        if (serviceError) throw serviceError;
      }
    }

    // Handle testimonials
    if (portfolioData.testimonials && portfolioData.testimonials.length > 0) {
      // Get existing testimonials to determine what to delete
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: existingTestimonials } = await supabase
        .from('portfolio_testimonials')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingTestimonials?.map(p => p.id) || [];
      const newIds = portfolioData.testimonials.map(p => p.id);
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      // Delete removed testimonials
      if (idsToDelete.length > 0) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: deleteError } = await supabase
          .from('portfolio_testimonials')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Upsert testimonials
      for (const testimonial of portfolioData.testimonials) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: testimonialError } = await supabase
          .from('portfolio_testimonials')
          .upsert({
            id: testimonial.id,
            portfolio_id: portfolioId,
            name: testimonial.name,
            company: testimonial.company,
            content: testimonial.content,
            avatar_url: testimonial.avatarUrl,
            rating: testimonial.rating,
            updated_at: new Date().toISOString()
          });
        
        if (testimonialError) throw testimonialError;
      }
    }

    // Handle team members and their social links
    if (portfolioData.teamMembers && portfolioData.teamMembers.length > 0) {
      // Get existing team members to determine what to delete
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: existingTeamMembers } = await supabase
        .from('portfolio_team_members')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingTeamMembers?.map(p => p.id) || [];
      const newIds = portfolioData.teamMembers.map(p => p.id);
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      // Delete removed team members
      if (idsToDelete.length > 0) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: deleteError } = await supabase
          .from('portfolio_team_members')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Upsert team members
      for (const member of portfolioData.teamMembers) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { data: memberData, error: memberError } = await supabase
          .from('portfolio_team_members')
          .upsert({
            id: member.id,
            portfolio_id: portfolioId,
            name: member.name,
            role: member.role,
            bio: member.bio,
            email: member.email,
            avatar_url: member.avatarUrl,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (memberError) throw memberError;
        
        // Handle social links for this team member
        if (member.socialLinks && member.socialLinks.length > 0) {
          // Get existing social links to determine what to delete
          // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
          const { data: existingSocialLinks } = await supabase
            .from('portfolio_team_member_social_links')
            .select('id')
            .eq('team_member_id', member.id);
          
          const existingSocialIds = existingSocialLinks?.map(p => p.id) || [];
          const newSocialIds = member.socialLinks.map(p => p.id).filter(id => id);
          const socialIdsToDelete = existingSocialIds.filter(id => !newSocialIds.includes(id));
          
          // Delete removed social links
          if (socialIdsToDelete.length > 0) {
            // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
            const { error: deleteSocialError } = await supabase
              .from('portfolio_team_member_social_links')
              .delete()
              .in('id', socialIdsToDelete);
            
            if (deleteSocialError) throw deleteSocialError;
          }
          
          // Upsert social links
          for (const socialLink of member.socialLinks) {
            // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
            const { error: socialLinkError } = await supabase
              .from('portfolio_team_member_social_links')
              .upsert({
                id: socialLink.id,
                team_member_id: member.id,
                platform: socialLink.platform,
                url: socialLink.url,
                icon: socialLink.icon,
                updated_at: new Date().toISOString()
              });
            
            if (socialLinkError) throw socialLinkError;
          }
        }
      }
    }

    // Handle social links
    if (portfolioData.socialLinks && portfolioData.socialLinks.length > 0) {
      // Get existing social links to determine what to delete
      // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
      const { data: existingSocialLinks } = await supabase
        .from('portfolio_social_links')
        .select('id')
        .eq('portfolio_id', portfolioId);
      
      const existingIds = existingSocialLinks?.map(p => p.id) || [];
      const newIds = portfolioData.socialLinks.map(p => p.id).filter(id => id);
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      // Delete removed social links
      if (idsToDelete.length > 0) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: deleteError } = await supabase
          .from('portfolio_social_links')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Upsert social links
      for (const link of portfolioData.socialLinks) {
        // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
        const { error: linkError } = await supabase
          .from('portfolio_social_links')
          .upsert({
            id: link.id,
            portfolio_id: portfolioId,
            platform: link.platform,
            url: link.url,
            icon: link.icon,
            updated_at: new Date().toISOString()
          });
        
        if (linkError) throw linkError;
      }
    }

    return portfolioId;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    toast.error('Failed to save portfolio');
    return null;
  }
};

// Delete portfolio and all related data
export const deletePortfolio = async (id: string): Promise<boolean> => {
  try {
    // Due to cascading deletes set up in the database schema,
    // we only need to delete the main portfolio entry
    // @ts-ignore - Ignoring type checking for this call since supabase types are not up-to-date
    const { error } = await supabase
      .from('portfolio_data')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    toast.error('Failed to delete portfolio');
    return false;
  }
};