
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portfolio, Experience, Skill, PortfolioProject, PortfolioService } from "@/types/portfolio";
import { getExtendedPortfolioData } from "@/services/portfolioService";
import PortfolioPreview from "@/components/portfolio/PortfolioPreview";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";

const PortfolioPreviewPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [previousTheme, setPreviousTheme] = useState<"dark" | "light">(theme);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [services, setServices] = useState<PortfolioService[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Force light mode for portfolio preview
  useEffect(() => {
    // Save the current theme before switching to light
    if (theme === "dark") {
      setPreviousTheme(theme);
      setTheme("light");
    }
    
    // Restore the previous theme when component unmounts
    return () => {
      if (previousTheme === "dark") {
        setTheme(previousTheme);
      }
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let portfolioData;
        
        if (id) {
          // Fetch specific portfolio by ID (public view)
          const { data: portfolioResult, error } = await supabase
            .from("portfolios")
            .select("*")
            .eq("id", id)
            .single();
            
          if (error || !portfolioResult) {
            console.error("Error fetching portfolio:", error);
            toast({
              title: "Portfolio not found",
              description: "The requested portfolio could not be found.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          
          portfolioData = portfolioResult;
          
          // Get skills
          const { data: skillsData } = await supabase
            .from("portfolio_skills")
            .select("*")
            .eq("portfolio_id", portfolioData.id);

          // Get projects
          const { data: projectsData } = await supabase
            .from("portfolio_projects")
            .select("*")
            .eq("portfolio_id", portfolioData.id);

          // Get experiences
          const { data: experiencesData } = await supabase
            .from("portfolio_experiences")
            .select("*")
            .eq("portfolio_id", portfolioData.id);
            
          // Get services
          const { data: servicesData } = await supabase
            .from("portfolio_services")
            .select("*")
            .eq("portfolio_id", portfolioData.id);
            
          setPortfolio({
            ...portfolioData,
            contact: typeof portfolioData.contact === 'string' 
                ? JSON.parse(portfolioData.contact) 
                : portfolioData.contact
          });
          setSkills(skillsData || []);
          setProjects(projectsData || []);
          setExperiences(experiencesData || []);
          setServices(servicesData || []);
        } else {
          // Get current user's portfolio
          const data = await getExtendedPortfolioData();
          
          if (data) {
            setPortfolio(data);
            setSkills(data.skills);
            setProjects(data.projects);
            setExperiences(data.experiences);
            setServices(data.services || []);
          } else {
            toast({
              title: "Error loading portfolio",
              description: "Unable to load portfolio data.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        toast({
          title: "Error",
          description: "Failed to load portfolio data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-semibold mb-4">Portfolio Not Found</h2>
        <p className="text-muted-foreground mb-6 text-center">
          The portfolio you're looking for doesn't exist or isn't published yet.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen light">
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button asChild>
            <Link to="/portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
            </Link>
          </Button>
        </div>
      )}
      <PortfolioPreview
        portfolio={portfolio}
        skills={skills}
        projects={projects}
        experiences={experiences}
        services={services}
        onBack={() => {
          window.history.back();
        }}
      />
    </div>
  );
};

export default PortfolioPreviewPage;
