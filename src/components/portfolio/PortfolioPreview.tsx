import { useEffect, useState } from "react";
import { PortfolioProjectCard } from "./PortfolioProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Globe, 
  Mail, 
  MapPin, 
  Phone,
  Linkedin,
  ArrowLeft,
  Download,
  Share2,
  ExternalLink,
} from "lucide-react";
import { 
  ExtendedPortfolioData, 
  PortfolioProject,
  Skill
} from "@/types/portfolio";
import { getPortfolioData, exportPortfolioToPDF, sharePortfolio } from "@/services/portfolioDataService";
import { toast } from "sonner";

export function PortfolioPreview() {
  const [portfolioData, setPortfolioData] = useState<ExtendedPortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    loadPortfolioData();
  }, []);
  
  const loadPortfolioData = () => {
    setIsLoading(true);
    try {
      const data = getPortfolioData();
      setPortfolioData(data);
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      toast.error("Failed to load portfolio data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportClick = () => {
    exportPortfolioToPDF();
  };
  
  const handleShareClick = () => {
    sharePortfolio(portfolioData?.name);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Portfolio Data Found</h2>
        <p className="text-muted-foreground mb-6">
          It seems you haven't created a portfolio yet. Return to the Portfolio Generator to create your professional portfolio.
        </p>
        <Button asChild>
          <a href="/portfolio-generator">Create Portfolio</a>
        </Button>
      </div>
    );
  }

  const skillsByCategory: Record<string, Skill[]> = {};
  
  if (portfolioData.skills) {
    portfolioData.skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });
  }
  
  const filteredProjects = activeTab === 'all' 
    ? portfolioData.projects 
    : portfolioData.projects.filter(project => 
        project.technologies?.includes(activeTab)
      );
  
  // Get unique technologies from all projects
  const allTechnologies = new Set<string>();
  portfolioData.projects.forEach(project => {
    if (project.technologies) {
      project.technologies.forEach(tech => {
        allTechnologies.add(tech);
      });
    }
  });

  return (
    <div className={`portfolio-theme-${portfolioData.theme || 'default'}`}>
      {/* Banner */}
      <div className="relative h-60 md:h-80 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
        {portfolioData.bannerImage && (
          <img 
            src={portfolioData.bannerImage} 
            alt="Portfolio Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent h-1/2"></div>
      </div>
      
      {/* Portfolio Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20">
        <div className="bg-card shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
            {/* Logo/Avatar */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-xl overflow-hidden border-4 border-background shadow-md bg-muted flex items-center justify-center">
                {portfolioData.logoImage ? (
                  <img 
                    src={portfolioData.logoImage} 
                    alt={portfolioData.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-muted-foreground">
                    {portfolioData.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Title Information */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{portfolioData.name}</h1>
              <p className="text-xl text-muted-foreground mt-1">{portfolioData.title}</p>
              {portfolioData.subtitle && (
                <p className="text-muted-foreground mt-1">{portfolioData.subtitle}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolioData.contact?.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.contact.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-1 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
                {portfolioData.contact?.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {portfolioData.contact?.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-1 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-2 self-start mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleExportClick}>
                <Download className="mr-1 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareClick}>
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/portfolio-generator">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Edit
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                <p className="text-muted-foreground whitespace-pre-line">{portfolioData.bio}</p>
                
                {/* Contact Information */}
                <h3 className="text-lg font-semibold mt-6 mb-3">Contact</h3>
                <div className="space-y-2">
                  {portfolioData.contact?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${portfolioData.contact.email}`} className="text-sm hover:underline">
                        {portfolioData.contact.email}
                      </a>
                    </div>
                  )}
                  {portfolioData.contact?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${portfolioData.contact.phone}`} className="text-sm hover:underline">
                        {portfolioData.contact.phone}
                      </a>
                    </div>
                  )}
                  {portfolioData.contact?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{portfolioData.contact.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Skills */}
            {Object.keys(skillsByCategory).length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Skills</h2>
                  <div className="space-y-6">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-3 capitalize">{category}</h3>
                        <div className="space-y-3">
                          {skills.map(skill => (
                            <div key={skill.id || skill.name}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-xs text-muted-foreground">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary rounded-full h-2" 
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Experience */}
            {portfolioData.experiences && portfolioData.experiences.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Experience</h2>
                  <div className="space-y-6">
                    {portfolioData.experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 pl-4 pb-1 border-muted">
                        <h3 className="font-semibold">{exp.role}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{exp.company}</p>
                        <div className="text-xs text-muted-foreground mb-2">
                          {exp.startDate && (
                            <>
                              {exp.startDate}
                              {exp.isCurrent ? (
                                <span> - Present</span>
                              ) : (
                                exp.endDate && <span> - {exp.endDate}</span>
                              )}
                            </>
                          )}
                          {exp.location && (
                            <span className="ml-2">| {exp.location}</span>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main Content - Projects */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Projects</h2>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className={activeTab === 'all' ? 'bg-muted' : ''} onClick={() => setActiveTab('all')}>
                    All
                  </Button>
                  {Array.from(allTechnologies).slice(0, 5).map(tech => (
                    <Button 
                      key={tech}
                      variant="ghost" 
                      size="sm"
                      className={activeTab === tech ? 'bg-muted' : ''}
                      onClick={() => setActiveTab(tech)}
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>
              
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No projects found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map(project => (
                    <PortfolioProjectCard 
                      key={project.id} 
                      project={project} 
                    />
                  ))}
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Additional Sections Would Go Here */}
          </div>
        </div>
      </div>
    </div>
  );
}