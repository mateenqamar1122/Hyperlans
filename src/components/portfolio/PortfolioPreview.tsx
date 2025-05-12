import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Linkedin, Mail, Phone, Globe, Twitter, MapPin, Calendar } from "lucide-react";
import { Portfolio, Experience, Skill, PortfolioProject, PortfolioService } from "@/types/portfolio";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  skills: Skill[];
  projects: PortfolioProject[];
  experiences: Experience[];
  services: PortfolioService[];
  onBack: () => void;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({
  portfolio,
  skills,
  projects,
  experiences,
  services,
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const portfolioRef = useRef<HTMLDivElement>(null);

  const getThemeClasses = () => {
    switch (portfolio.theme) {
      case 'modern':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          card: 'bg-white shadow-md border border-gray-100 hover:shadow-lg',
          cardHover: 'hover:border-indigo-200 hover:translate-y-[-5px]',
          highlight: 'text-indigo-600',
          button: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90',
          buttonOutline: 'border-indigo-400 text-indigo-600 hover:bg-indigo-50',
          headerBg: 'bg-gradient-to-r from-gray-50 to-indigo-50',
        };
      case 'classic':
        return {
          bg: 'bg-white',
          text: 'text-gray-800',
          accent: 'bg-amber-600',
          card: 'bg-white shadow-md border border-gray-100 hover:shadow-lg',
          cardHover: 'hover:border-amber-200 hover:translate-y-[-5px]',
          highlight: 'text-amber-600',
          button: 'bg-amber-600 hover:bg-amber-700',
          buttonOutline: 'border-amber-600 text-amber-600 hover:bg-amber-50',
          headerBg: 'bg-amber-50',
        };
      case 'minimal':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-gray-900',
          card: 'bg-white shadow-sm border border-gray-200 hover:shadow-md',
          cardHover: 'hover:border-gray-400 hover:translate-y-[-5px]',
          highlight: 'text-gray-900',
          button: 'bg-gray-900 hover:bg-gray-800',
          buttonOutline: 'border-gray-400 text-gray-700 hover:bg-gray-50',
          headerBg: 'bg-gray-50',
        };
      case 'bold':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-gradient-to-r from-orange-500 to-pink-500',
          card: 'bg-white shadow-md border border-gray-100 hover:shadow-xl',
          cardHover: 'hover:border-pink-200 hover:translate-y-[-5px]',
          highlight: 'text-pink-600',
          button: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90',
          buttonOutline: 'border-pink-400 text-pink-600 hover:bg-pink-50',
          headerBg: 'bg-gradient-to-r from-orange-50 to-pink-50',
        };
      case 'creative':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-gradient-to-r from-purple-500 to-violet-500',
          card: 'bg-white shadow-md border border-gray-100 hover:shadow-xl',
          cardHover: 'hover:border-purple-200 hover:translate-y-[-5px]',
          highlight: 'text-violet-600',
          button: 'bg-gradient-to-r from-purple-500 to-violet-500 hover:opacity-90',
          buttonOutline: 'border-violet-400 text-violet-600 hover:bg-violet-50',
          headerBg: 'bg-gradient-to-r from-violet-50 to-purple-50',
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-blue-600',
          card: 'bg-white shadow-md border border-gray-100 hover:shadow-xl',
          cardHover: 'hover:border-blue-200 hover:translate-y-[-5px]',
          highlight: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          buttonOutline: 'border-blue-400 text-blue-600 hover:bg-blue-50',
          headerBg: 'bg-blue-50',
        };
    }
  };

  const theme = getThemeClasses();
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);
  const featuredServices = services.filter(s => s.is_featured);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  const renderSkillsByCategory = () => {
    const categories = Array.from(new Set(skills.map(skill => skill.category)));
    
    return categories.map(category => (
      <div key={category} className="mb-8">
        <h3 className={`text-xl font-bold mb-3 capitalize ${theme.highlight}`}>
          {category} Skills
        </h3>
        <div className="space-y-4">
          {skills
            .filter(skill => skill.category === category)
            .map(skill => (
              <div key={skill.id} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm">{skill.level}%</span>
                </div>
                <div className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full ${theme.accent} rounded-full`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    ));
  };

  const downloadPDF = async () => {
    if (!portfolioRef.current) return;
    
    try {
      toast({
        title: "Preparing PDF",
        description: "Please wait while we generate your PDF...",
      });

      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      let currentPage = 1;
      let verticalOffset = 0;
      
      // First, capture the banner (if available)
      if (portfolio.banner_url) {
        const banner = document.getElementById('portfolio-banner');
        if (banner) {
          const bannerCanvas = await html2canvas(banner, {
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          // Calculate aspect ratio to fit width
          const imgWidth = pageWidth;
          const imgHeight = (bannerCanvas.height * imgWidth) / bannerCanvas.width;
          
          // Add banner image
          const bannerImgData = bannerCanvas.toDataURL('image/jpeg', 1.0);
          doc.addImage(bannerImgData, 'JPEG', 0, verticalOffset, imgWidth, imgHeight);
          verticalOffset += imgHeight + 10;
        }
      }

      // Add header with name and title
      const header = document.getElementById('portfolio-header');
      if (header) {
        const headerCanvas = await html2canvas(header, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgWidth = pageWidth - 40; // Add some margin
        const imgHeight = (headerCanvas.height * imgWidth) / headerCanvas.width;
        
        // Add header image
        const headerImgData = headerCanvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(headerImgData, 'JPEG', 20, verticalOffset, imgWidth, imgHeight);
        verticalOffset += imgHeight + 20;
      }

      // Add about section
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        // Check if we need a new page
        if (verticalOffset > pageHeight - 100) {
          doc.addPage();
          currentPage++;
          verticalOffset = 20;
        }
      
        const aboutCanvas = await html2canvas(aboutSection, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgWidth = pageWidth - 40;
        const imgHeight = (aboutCanvas.height * imgWidth) / aboutCanvas.width;
        
        // Check if this section will fit on current page
        if (verticalOffset + imgHeight > pageHeight) {
          doc.addPage();
          currentPage++;
          verticalOffset = 20;
        }
        
        // Add about section image
        const aboutImgData = aboutCanvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(aboutImgData, 'JPEG', 20, verticalOffset, imgWidth, imgHeight);
        verticalOffset += imgHeight + 20;
      }

      // Add skills section
      const skillsSection = document.getElementById('skills-section');
      if (skillsSection && skills.length > 0) {
        // Check if we need a new page
        if (verticalOffset > pageHeight - 100) {
          doc.addPage();
          currentPage++;
          verticalOffset = 20;
        }
      
        const skillsCanvas = await html2canvas(skillsSection, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgWidth = pageWidth - 40;
        const imgHeight = (skillsCanvas.height * imgWidth) / skillsCanvas.width;
        
        // Check if this section will fit on current page
        if (verticalOffset + imgHeight > pageHeight) {
          doc.addPage();
          currentPage++;
          verticalOffset = 20;
        }
        
        // Add skills section image
        const skillsImgData = skillsCanvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(skillsImgData, 'JPEG', 20, verticalOffset, imgWidth, imgHeight);
        verticalOffset += imgHeight + 20;
      }

      // Add experience section
      const experienceSection = document.getElementById('experience-section');
      if (experienceSection && experiences.length > 0) {
        doc.addPage();
        currentPage++;
        verticalOffset = 20;
        
        const experienceCanvas = await html2canvas(experienceSection, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgWidth = pageWidth - 40;
        const imgHeight = (experienceCanvas.height * imgWidth) / experienceCanvas.width;
        
        // Add experience section image
        const experienceImgData = experienceCanvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(experienceImgData, 'JPEG', 20, verticalOffset, imgWidth, imgHeight);
      }

      // Add projects section
      if (projects.length > 0) {
        doc.addPage();
        currentPage++;
        verticalOffset = 20;
        
        const projectsSection = document.getElementById('projects-section');
        if (projectsSection) {
          const projectsCanvas = await html2canvas(projectsSection, {
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          const imgWidth = pageWidth - 40;
          const imgHeight = (projectsCanvas.height * imgWidth) / projectsCanvas.width;
          
          // Add projects section image
          const projectsImgData = projectsCanvas.toDataURL('image/jpeg', 1.0);
          doc.addImage(projectsImgData, 'JPEG', 20, verticalOffset, imgWidth, imgHeight);
        }
      }

      // Add services section
      if (services.length > 0) {
        doc.addPage();
        currentPage++;
        verticalOffset = 20;
        
        const servicesSection = document.getElementById('services-section');
        if (servicesSection) {
          const servicesCanvas = await html2canvas(servicesSection, {
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          const imgWidth = pageWidth - 40;
          const imgHeight = (servicesCanvas.height * imgWidth) / servicesCanvas.width;
          
          // Add services section image
          const servicesImgData = servicesCanvas.toDataURL('image/jpeg', 1.0);
          doc.addImage(servicesImgData, 'JPEG', 20, verticalOffset, imgWidth, imgHeight);
        }
      }

      // Save the PDF
      doc.save(`${portfolio.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.pdf`);
      
      toast({
        title: "PDF downloaded",
        description: "Your portfolio has been successfully downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get service icon
  const getServiceIcon = (iconName?: string) => {
    // This would be expanded with more icons
    switch (iconName?.toLowerCase()) {
      case "code":
        return <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        </div>
      case "design":
        return <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
        </div>
      case "marketing":
        return <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
        </div>
      case "consulting":
        return <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 1 0 7.75"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
      default:
        return <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
    }
  };

  return (
    <div ref={portfolioRef} className={`min-h-screen ${theme.bg} ${theme.text}`}>
      {/* Banner at the top of the page */}
      {portfolio.banner_url && (
        <div id="portfolio-banner" className="w-full h-64 md:h-80 relative overflow-hidden">
          <img 
            src={portfolio.banner_url} 
            alt="Portfolio Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      )}
      
      {/* Header section */}
      <header id="portfolio-header" className={`${theme.headerBg} py-16 px-4 relative ${!portfolio.banner_url ? 'pt-20' : '-mt-16'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mt-6">
            {portfolio.logo_url && (
              <div className="mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                  <img 
                    src={portfolio.logo_url} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">{portfolio.name}</h1>
              <h2 className="text-xl md:text-2xl mt-2 font-medium">{portfolio.title}</h2>
              {portfolio.subtitle && <p className="mt-2 text-gray-600">{portfolio.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {portfolio.contact?.email && (
                  <Button variant="outline" size="sm" className={`${theme.buttonOutline} shadow-sm`} asChild>
                    <a href={`mailto:${portfolio.contact.email}`}>
                      <Mail className="w-4 h-4 mr-1" /> Email
                    </a>
                  </Button>
                )}
                {portfolio.contact?.phone && (
                  <Button variant="outline" size="sm" className={`${theme.buttonOutline} shadow-sm`} asChild>
                    <a href={`tel:${portfolio.contact.phone}`}>
                      <Phone className="w-4 h-4 mr-1" /> Call
                    </a>
                  </Button>
                )}
                {portfolio.contact?.website && (
                  <Button variant="outline" size="sm" className={`${theme.buttonOutline} shadow-sm`} asChild>
                    <a href={portfolio.contact.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-1" /> Website
                    </a>
                  </Button>
                )}
                {portfolio.contact?.linkedin && (
                  <Button variant="outline" size="sm" className={`${theme.buttonOutline} shadow-sm`} asChild>
                    <a href={`https://linkedin.com/in/${portfolio.contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
                    </a>
                  </Button>
                )}
                {portfolio.contact?.twitter && (
                  <Button variant="outline" size="sm" className={`${theme.buttonOutline} shadow-sm`} asChild>
                    <a href={`https://twitter.com/${portfolio.contact.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-4 h-4 mr-1" /> Twitter
                    </a>
                  </Button>
                )}
                {portfolio.contact?.github && (
                  <Button variant="outline" size="sm" className={`${theme.buttonOutline} shadow-sm`} asChild>
                    <a href={`https://github.com/${portfolio.contact.github}`} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-1" /> GitHub
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* About */}
        <section id="about-section" className="mb-20">
          <div className="flex items-center mb-8">
            <div className={`h-1 w-12 ${theme.accent} mr-4 rounded-full`}></div>
            <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
          </div>
          <div className={`p-8 rounded-xl ${theme.card} ${theme.cardHover} transition-all duration-300`}>
            <p className="whitespace-pre-wrap leading-relaxed">{portfolio.bio}</p>
          </div>
        </section>
        
        {/* Skills */}
        {skills.length > 0 && (
          <section id="skills-section" className="mb-20">
            <div className="flex items-center mb-8">
              <div className={`h-1 w-12 ${theme.accent} mr-4 rounded-full`}></div>
              <h2 className="text-3xl font-bold tracking-tight">My Skills</h2>
            </div>
            <div className={`p-8 rounded-xl ${theme.card} ${theme.cardHover} transition-all duration-300`}>
              {renderSkillsByCategory()}
            </div>
          </section>
        )}
        
        {/* Services */}
        {services.length > 0 && (
          <section id="services-section" className="mb-20">
            <div className="flex items-center mb-8">
              <div className={`h-1 w-12 ${theme.accent} mr-4 rounded-full`}></div>
              <h2 className="text-3xl font-bold tracking-tight">My Services</h2>
            </div>
            
            {featuredServices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredServices.map((service) => (
                  <div 
                    key={service.id} 
                    className={`p-8 rounded-xl ${theme.card} ${theme.cardHover} transition-all duration-300 flex flex-col group`}
                  >
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                    {service.price && (
                      <p className={`text-sm mb-3 ${theme.highlight} font-medium`}>{service.price}</p>
                    )}
                    <p className="text-sm opacity-80 flex-grow">{service.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            {services.length > featuredServices.length && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services
                  .filter(s => !s.is_featured)
                  .map((service) => (
                    <div 
                      key={service.id} 
                      className={`p-6 rounded-xl ${theme.card} ${theme.cardHover} transition-all duration-300 group`}
                    >
                      <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                      {service.price && (
                        <p className={`text-sm mb-2 ${theme.highlight}`}>{service.price}</p>
                      )}
                      <p className="text-sm opacity-80">{service.description}</p>
                    </div>
                ))}
              </div>
            )}
          </section>
        )}
        
        {/* Experience */}
        {experiences.length > 0 && (
          <section id="experience-section" className="mb-20">
            <div className="flex items-center mb-8">
              <div className={`h-1 w-12 ${theme.accent} mr-4 rounded-full`}></div>
              <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
            </div>
            <div className={`p-8 rounded-xl ${theme.card} ${theme.cardHover} transition-all duration-300`}>
              <div className="space-y-10">
                {experiences.map((exp, index) => (
                  <div key={exp.id || index} className="relative">
                    {/* Timeline connector */}
                    {index < experiences.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${theme.accent} mt-1 shadow-lg`}>
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="font-bold text-xl">{exp.title}</h3>
                          <div className="text-sm text-gray-500 font-medium">
                            {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <span className="font-medium">{exp.company}</span>
                          {exp.location && (
                            <span className="ml-2 text-sm text-gray-500 flex items-center inline-block">
                              <MapPin className="inline-block mr-1 h-3 w-3" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                        
                        {exp.description && (
                          <p className="text-sm text-gray-600">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Projects Section - Combined */}
        {projects.length > 0 && (
          <section id="projects-section" className="mb-20">
            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center mb-8">
                  <div className={`h-1 w-12 ${theme.accent} mr-4 rounded-full`}></div>
                  <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {featuredProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className={`rounded-xl overflow-hidden ${theme.card} ${theme.cardHover} transition-all duration-500 flex flex-col group`}
                    >
                      {project.image_url && (
                        <div className="h-56 overflow-hidden">
                          <img 
                            src={project.image_url} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-grow">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                        <p className="text-sm font-medium mb-3 text-gray-500">Client: {project.client}</p>
                        {project.description && (
                          <p className="text-sm mb-4 text-gray-600">{project.description}</p>
                        )}
                        
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium mb-2 text-gray-500">Technologies:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.map((tech) => (
                                <span 
                                  key={tech} 
                                  className="text-xs py-1 px-2 rounded bg-gray-100 text-gray-700 font-medium transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-3 mt-4">
                          {project.url && (
                            <Button size="sm" className={theme.button} asChild>
                              <a href={project.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> View Project
                              </a>
                            </Button>
                          )}
                          
                          {project.github_url && (
                            <Button size="sm" variant="outline" className={theme.buttonOutline} asChild>
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3 h-3 mr-1" /> Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <div>
                <div className="flex items-center mb-8">
                  <div className={`h-1 w-12 ${theme.accent} mr-4 rounded-full`}></div>
                  <h2 className="text-3xl font-bold tracking-tight">Other Projects</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className={`rounded-xl overflow-hidden ${theme.card} ${theme.cardHover} transition-all duration-300 h-full flex flex-col group`}
                    >
                      {project.image_url && (
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={project.image_url} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                        <p className="text-sm mb-2 text-gray-500">{project.client}</p>
                        {project.description && (
                          <p className="text-xs mb-3 line-clamp-3 text-gray-600 flex-grow">{project.description}</p>
                        )}
                        
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span 
                                key={tech} 
                                className="text-xs py-0.5 px-1.5 rounded bg-gray-100 text-gray-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs py-0.5 px-1.5 rounded bg-gray-100 text-gray-700">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.url && (
                            <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                              <a href={project.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" /> View
                              </a>
                            </Button>
                          )}
                          
                          {project.github_url && (
                            <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3 h-3 mr-1" /> Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default PortfolioPreview;
