
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Download, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Portfolio as PortfolioType, PortfolioProject, Skill, Experience, PortfolioService } from "@/types/portfolio";
import { getExtendedPortfolioData } from "@/services/portfolioService";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioPreview from "@/components/portfolio/PortfolioPreview";
import PortfolioForm from "@/components/portfolio/PortfolioForm";
import SkillForm from "@/components/portfolio/SkillForm";
import SkillCard from "@/components/portfolio/SkillCard";
import ExperienceForm from "@/components/portfolio/ExperienceForm";
import ExperienceCard from "@/components/portfolio/ExperienceCard";
import ProjectForm from "@/components/portfolio/ProjectForm";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ServiceForm from "@/components/portfolio/ServiceForm";
import ServiceCard from "@/components/portfolio/ServiceCard";
import { deletePortfolioService } from "@/services/portfolioServicesService";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [services, setServices] = useState<PortfolioService[]>([]);
  
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(undefined);
  
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>(undefined);
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | undefined>(undefined);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<PortfolioService | undefined>(undefined);

  // Fetch portfolio data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getExtendedPortfolioData();
        
        if (data) {
          setPortfolio(data);
          setProjects(data.projects);
          setSkills(data.skills);
          setExperiences(data.experiences);
          setServices(data.services || []);
        } else {
          toast({
            title: "Error loading portfolio",
            description: "Unable to load your portfolio data.",
            variant: "destructive",
          });
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
  }, [toast]);

  // Handle portfolio update
  const handlePortfolioUpdate = (updatedPortfolio: PortfolioType) => {
    setPortfolio(updatedPortfolio);
  };

  // Skill handlers
  const handleAddSkill = (skill: Skill) => {
    setSkills([...skills, skill]);
    setShowSkillForm(false);
    setEditingSkill(undefined);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setShowSkillForm(true);
  };

  const handleSaveSkill = (updatedSkill: Skill) => {
    setSkills(skills.map(skill => skill.id === updatedSkill.id ? updatedSkill : skill));
    setShowSkillForm(false);
    setEditingSkill(undefined);
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  // Experience handlers
  const handleAddExperience = (experience: Experience) => {
    setExperiences([...experiences, experience]);
    setShowExperienceForm(false);
    setEditingExperience(undefined);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setShowExperienceForm(true);
  };

  const handleSaveExperience = (updatedExperience: Experience) => {
    setExperiences(experiences.map(exp => exp.id === updatedExperience.id ? updatedExperience : exp));
    setShowExperienceForm(false);
    setEditingExperience(undefined);
  };

  const handleDeleteExperience = (experienceId: string) => {
    setExperiences(experiences.filter(exp => exp.id !== experienceId));
  };

  // Project handlers
  const handleAddProject = (project: PortfolioProject) => {
    setProjects([...projects, project]);
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleEditProject = (project: PortfolioProject) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleSaveProject = (updatedProject: PortfolioProject) => {
    setProjects(projects.map(project => project.id === updatedProject.id ? updatedProject : project));
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  // Service handlers
  const handleAddService = (service: PortfolioService) => {
    setServices([...services, service]);
    setShowServiceForm(false);
    setEditingService(undefined);
  };

  const handleEditService = (service: PortfolioService) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleSaveService = (updatedService: PortfolioService) => {
    setServices(services.map(service => service.id === updatedService.id ? updatedService : service));
    setShowServiceForm(false);
    setEditingService(undefined);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const success = await deletePortfolioService(serviceId);
      
      if (success) {
        setServices(services.filter(service => service.id !== serviceId));
        toast({
          title: "Service deleted",
          description: "The service has been removed from your portfolio.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the service.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete the service.",
        variant: "destructive",
      });
    }
  };

  // Preview handlers
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // View published portfolio
  const viewPublishedPortfolio = () => {
    if (portfolio?.published_url) {
      navigate(`/portfolio-preview/${portfolio.id}`);
    }
  };
  
  // Share portfolio
  const sharePortfolio = () => {
    if (portfolio?.published_url) {
      try {
        navigator.share({
          title: `${portfolio.name}'s Portfolio`,
          text: `Check out ${portfolio.name}'s professional portfolio`,
          url: window.location.origin + `/portfolio-preview/${portfolio.id}`,
        });
      } catch (error) {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.origin + `/portfolio-preview/${portfolio.id}`);
        toast({
          title: "Link copied to clipboard",
          description: "Share this link with others to view your portfolio.",
        });
      }
    } else {
      toast({
        title: "Portfolio not published",
        description: "You need to publish your portfolio before sharing it.",
        variant: "destructive",
      });
    }
  };

  // Download as PDF function
  const downloadPDF = () => {
    toast({
      title: "Download initiated",
      description: "Your portfolio is being prepared as a PDF document.",
    });
    
    // Here we would implement PDF generation logic
    // For now, we'll just show a toast message
    setTimeout(() => {
      toast({
        title: "PDF feature coming soon",
        description: "PDF download functionality will be available in a future update.",
      });
    }, 2000);
  };

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

  if (showPreview && portfolio) {
    return (
      <PortfolioPreview
        portfolio={portfolio}
        skills={skills}
        projects={projects}
        experiences={experiences}
        services={services}
        onBack={togglePreview}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PortfolioHeader 
          portfolio={portfolio} 
          onPreviewClick={togglePreview} 
        />
        
        {portfolio && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={sharePortfolio} variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button onClick={downloadPDF} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        )}
      </div>

      {portfolio && portfolio.is_published && (
        <div className="my-4 p-4 bg-green-50 border border-green-100 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium text-green-800">
              Your portfolio is published!
            </p>
            <p className="text-sm text-green-700">
              You can share your portfolio with others.
            </p>
          </div>
          <Button onClick={viewPublishedPortfolio}>View Published Portfolio</Button>
        </div>
      )}

      <Tabs defaultValue="info" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          {/* <TabsTrigger value="appearance">Appearance</TabsTrigger> */}
        </TabsList>
        
        <TabsContent value="info">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Information</h2>
            {portfolio && (
              <PortfolioForm 
                portfolio={portfolio} 
                onUpdate={handlePortfolioUpdate} 
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="skills">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Skills</h2>
            <Button onClick={() => {
              setEditingSkill(undefined);
              setShowSkillForm(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Skill
            </Button>
          </div>
          
          {showSkillForm && portfolio ? (
            <div className="max-w-2xl mx-auto mb-8 p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <SkillForm 
                portfolioId={portfolio.id} 
                skill={editingSkill} 
                onSave={editingSkill ? handleSaveSkill : handleAddSkill} 
                onCancel={() => {
                  setShowSkillForm(false);
                  setEditingSkill(undefined);
                }} 
              />
            </div>
          ) : null}
          
          {skills.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">You haven't added any skills yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setEditingSkill(undefined);
                  setShowSkillForm(true);
                }}
              >
                Add Your First Skill
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <SkillCard 
                  key={skill.id} 
                  skill={skill} 
                  onEdit={handleEditSkill} 
                  onDelete={handleDeleteSkill} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="services">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Services</h2>
            <Button onClick={() => {
              setEditingService(undefined);
              setShowServiceForm(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Service
            </Button>
          </div>
          
          {showServiceForm && portfolio ? (
            <div className="max-w-3xl mx-auto mb-8 p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <ServiceForm 
                portfolioId={portfolio.id} 
                service={editingService} 
                onSave={editingService ? handleSaveService : handleAddService} 
                onCancel={() => {
                  setShowServiceForm(false);
                  setEditingService(undefined);
                }} 
              />
            </div>
          ) : null}
          
          {services.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">You haven't added any services yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setEditingService(undefined);
                  setShowServiceForm(true);
                }}
              >
                Add Your First Service
              </Button>
            </div>
          ) : (
            <>
              {services.filter(service => service.is_featured).length > 0 && (
                <>
                  <h3 className="text-xl font-medium mb-4">Featured Services</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {services
                      .filter(service => service.is_featured)
                      .map((service) => (
                        <ServiceCard 
                          key={service.id} 
                          service={service} 
                          onEdit={handleEditService} 
                          onDelete={handleDeleteService} 
                        />
                      ))}
                  </div>
                  
                  <Separator className="my-8" />
                </>
              )}
              
              <h3 className="text-xl font-medium mb-4">All Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onEdit={handleEditService} 
                    onDelete={handleDeleteService} 
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="experience">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Experience</h2>
            <Button onClick={() => {
              setEditingExperience(undefined);
              setShowExperienceForm(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
            </Button>
          </div>
          
          {showExperienceForm && portfolio ? (
            <div className="max-w-3xl mx-auto mb-8 p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </h3>
              <ExperienceForm 
                portfolioId={portfolio.id} 
                experience={editingExperience} 
                onSave={editingExperience ? handleSaveExperience : handleAddExperience} 
                onCancel={() => {
                  setShowExperienceForm(false);
                  setEditingExperience(undefined);
                }} 
              />
            </div>
          ) : null}
          
          {experiences.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">You haven't added any work experience yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setEditingExperience(undefined);
                  setShowExperienceForm(true);
                }}
              >
                Add Your First Experience
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {experiences.map((experience) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience} 
                  onEdit={handleEditExperience} 
                  onDelete={handleDeleteExperience} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="projects">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <Button onClick={() => {
              setEditingProject(undefined);
              setShowProjectForm(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </div>
          
          {showProjectForm && portfolio ? (
            <div className="max-w-4xl mx-auto mb-8 p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <ProjectForm 
                portfolioId={portfolio.id} 
                project={editingProject} 
                onSave={editingProject ? handleSaveProject : handleAddProject} 
                onCancel={() => {
                  setShowProjectForm(false);
                  setEditingProject(undefined);
                }} 
              />
            </div>
          ) : null}
          
          {projects.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Featured Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {projects
                  .filter(project => project.featured)
                  .map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onEdit={handleEditProject} 
                      onDelete={handleDeleteProject} 
                    />
                  ))}
                {projects.filter(project => project.featured).length === 0 && (
                  <p className="col-span-2 text-sm text-muted-foreground italic">
                    No featured projects yet. Add a project and mark it as featured to display it here.
                  </p>
                )}
              </div>
              
              <Separator className="my-8" />
              
              <h3 className="text-xl font-semibold mb-4">All Projects</h3>
            </>
          )}
          
          {projects.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">You haven't added any projects yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setEditingProject(undefined);
                  setShowProjectForm(true);
                }}
              >
                Add Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={handleEditProject} 
                  onDelete={handleDeleteProject} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Appearance Settings</h2>
            {portfolio && (
              <PortfolioForm 
                portfolio={portfolio} 
                onUpdate={handlePortfolioUpdate} 
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Portfolio;
