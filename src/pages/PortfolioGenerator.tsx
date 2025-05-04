
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Download,
  Edit,
  Eye,
  FileUp,
  Plus,
  Save,
  Share2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ExtendedPortfolioData, PortfolioProject, Skill } from "@/types/portfolio";
import { getPortfolioData, savePortfolioData, exportPortfolioToPDF, sharePortfolio } from "@/services/portfolioDataService";
import { uploadPortfolioImage } from "@/services/portfolioService";
import { getPortfolioProjects } from "@/services/portfolioProjectsService";
import { CTASection } from "@/components/blocks/cta-with-glow";
import { PortfolioProjectCard } from "@/components/portfolio/PortfolioProjectCard";
import { Progress } from "@/components/ui/progress";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter a name" }),
  title: z.string().min(2, { message: "Please enter a professional title" }),
  subtitle: z.string().optional(),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  theme: z.string().default("default"),
  layout: z.string().default("standard"),
  contact: z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
    github: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
    website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  }),
});

type FormData = z.infer<typeof formSchema>;

const defaultFormValues: FormData = {
  name: "My Professional Portfolio",
  title: "Full-Stack Developer",
  subtitle: "Building innovative digital experiences",
  bio: "I'm a passionate developer with expertise in creating modern web applications using React, TypeScript, and Node.js. I focus on delivering high-quality, user-friendly solutions that solve real business problems.",
  theme: "default",
  layout: "standard",
  contact: {
    email: "contact@example.com",
    phone: "",
    location: "Remote / Worldwide",
    linkedin: "",
    github: "",
    website: "",
  },
};

const PortfolioGenerator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [logoImage, setLogoImage] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [availableProjects, setAvailableProjects] = useState<PortfolioProject[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<{name: string, level: number, category: string}>({
    name: "",
    level: 75,
    category: "technical",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // Load existing portfolio data if available
  useEffect(() => {
    setIsLoading(true);
    const portfolioData = getPortfolioData();
    
    if (portfolioData) {
      form.reset({
        name: portfolioData.name,
        title: portfolioData.title,
        subtitle: portfolioData.subtitle || "",
        bio: portfolioData.bio,
        theme: portfolioData.theme,
        layout: portfolioData.layout,
        contact: {
          email: portfolioData.contact.email,
          phone: portfolioData.contact.phone || "",
          location: portfolioData.contact.location || "",
          linkedin: portfolioData.contact.linkedin || "",
          github: portfolioData.contact.github || "",
          website: portfolioData.contact.website || "",
        },
      });
      
      if (portfolioData.projects) setProjects(portfolioData.projects);
      if (portfolioData.skills) setSkills(portfolioData.skills);
      if (portfolioData.logoImage) setLogoImage(portfolioData.logoImage);
      if (portfolioData.bannerImage) setBannerImage(portfolioData.bannerImage);
    }
    
    // Load available projects from database
    const loadProjects = async () => {
      try {
        const dbProjects = await getPortfolioProjects();
        // Transform DB projects to PortfolioProject format
        const transformedProjects: PortfolioProject[] = dbProjects.map(dbProject => ({
          id: dbProject.id,
          title: dbProject.title,
          description: dbProject.description || "",
          technologies: dbProject.technologies || [],
          image: dbProject.image_url || "",
          link: dbProject.url,
          featured: dbProject.is_featured || false,
        }));
        
        setAvailableProjects(transformedProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Failed to load existing projects");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const portfolioData: ExtendedPortfolioData = {
        ...data,
        projects,
        skills,
        experiences: [],
        logoImage,
        bannerImage
      };
      
      await savePortfolioData(portfolioData);
      toast.success("Portfolio saved successfully!");
      navigate("/portfolio-preview");
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast.error("Failed to save portfolio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading logo...");
      const imageUrl = await uploadPortfolioImage(file);
      
      if (imageUrl) {
        setLogoImage(imageUrl);
        toast.success("Logo uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload logo");
      console.error("Upload error:", error);
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading banner...");
      const imageUrl = await uploadPortfolioImage(file);
      
      if (imageUrl) {
        setBannerImage(imageUrl);
        toast.success("Banner uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload banner");
      console.error("Upload error:", error);
    }
  };

  const handleAddProject = (projectId: string) => {
    const projectToAdd = availableProjects.find(p => p.id === projectId);
    if (projectToAdd && !projects.some(p => p.id === projectId)) {
      setProjects([...projects, projectToAdd]);
      toast.success(`Added project: ${projectToAdd.title}`);
    }
  };

  const handleRemoveProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success("Project removed from portfolio");
  };

  const handleAddSkill = () => {
    if (!newSkill.name) {
      toast.error("Please enter a skill name");
      return;
    }
    
    const skill: Skill = {
      id: uuidv4(),
      name: newSkill.name,
      level: newSkill.level,
      category: newSkill.category,
    };
    
    setSkills([...skills, skill]);
    setNewSkill({
      name: "",
      level: 75,
      category: "technical",
    });
    
    toast.success(`Skill added: ${skill.name}`);
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId));
    toast.success("Skill removed");
  };

  const handlePreview = () => {
    const portfolioData: ExtendedPortfolioData = {
      ...form.getValues(),
      projects,
      skills,
      experiences: [],
      logoImage,
      bannerImage
    };
    
    savePortfolioData(portfolioData);
    navigate("/portfolio-preview");
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Generator</h1>
          <p className="text-muted-foreground">Create a professional portfolio in minutes</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePreview} variant="outline">
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          
          <Button onClick={() => exportPortfolioToPDF()} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          
          <Button onClick={() => sharePortfolio(form.getValues().name)} variant="outline">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" /> Save Portfolio
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        
        {/* Basic Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter your portfolio details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Professional Portfolio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Full-Stack Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline / Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Building innovative digital experiences" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your professional background, expertise, and what makes you unique..." 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contact.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contact.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contact.location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contact.website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://yourwebsite.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contact.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contact.github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://github.com/yourusername" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("appearance")}>
                Next: Appearance
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" /> Save Details
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Appearance</CardTitle>
              <CardDescription>Customize how your portfolio looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Logo Upload</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 border rounded-md flex items-center justify-center bg-muted overflow-hidden">
                        {logoImage ? (
                          <img 
                            src={logoImage} 
                            alt="Logo" 
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">No logo</span>
                        )}
                      </div>
                      <div>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={() => document.getElementById("logo-upload")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload Logo
                        </Button>
                        <p className="text-sm text-muted-foreground mt-1">
                          Recommended size: 200x200px
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Banner Image</h3>
                    <div className="space-y-3">
                      <div className="w-full h-32 border rounded-md bg-muted overflow-hidden">
                        {bannerImage ? (
                          <img 
                            src={bannerImage} 
                            alt="Banner" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-muted-foreground text-sm">No banner image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Input
                          id="banner-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={() => document.getElementById("banner-upload")?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload Banner Image
                        </Button>
                        <p className="text-sm text-muted-foreground mt-1">
                          Recommended size: 1200x400px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme Options</h3>
                    <Form {...form}>
                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color Theme</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Blue Modern</SelectItem>
                                <SelectItem value="purple">Purple Dreams</SelectItem>
                                <SelectItem value="teal">Teal Professional</SelectItem>
                                <SelectItem value="green">Green Nature</SelectItem>
                                <SelectItem value="dark">Dark Mode</SelectItem>
                                <SelectItem value="light">Light Minimal</SelectItem>
                                <SelectItem value="gradient">Gradient Pop</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose a color scheme for your portfolio
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="layout"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Layout Style</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a layout" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="minimal">Minimal</SelectItem>
                                <SelectItem value="grid">Grid Focus</SelectItem>
                                <SelectItem value="cards">Card Based</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the overall layout of your portfolio
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </Form>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme Preview</h3>
                    <div className={`p-4 rounded-md shadow-sm ${
                      form.watch("theme") === "purple" ? "bg-purple-50 border border-purple-200" :
                      form.watch("theme") === "teal" ? "bg-teal-50 border border-teal-200" :
                      form.watch("theme") === "green" ? "bg-green-50 border border-green-200" :
                      form.watch("theme") === "dark" ? "bg-gray-800 text-white" :
                      form.watch("theme") === "light" ? "bg-gray-50 border border-gray-200" :
                      form.watch("theme") === "gradient" ? "bg-gradient-to-r from-blue-100 to-purple-100" :
                      "bg-blue-50 border border-blue-200" // default
                    }`}>
                      <div className="space-y-2">
                        <div className="font-medium">Sample Heading</div>
                        <div className="text-sm">
                          This is a preview of how your content will look with the selected theme.
                        </div>
                        <div className="flex gap-2 mt-2">
                          <div className={`w-20 h-8 rounded-md flex items-center justify-center text-xs text-white ${
                            form.watch("theme") === "purple" ? "bg-purple-500" :
                            form.watch("theme") === "teal" ? "bg-teal-500" :
                            form.watch("theme") === "green" ? "bg-green-500" :
                            form.watch("theme") === "dark" ? "bg-gray-600" :
                            form.watch("theme") === "light" ? "bg-gray-400" :
                            form.watch("theme") === "gradient" ? "bg-gradient-to-r from-blue-500 to-purple-500" :
                            "bg-blue-500" // default
                          }`}>
                            Button
                          </div>
                          <div className={`w-20 h-8 rounded-md border flex items-center justify-center text-xs ${
                            form.watch("theme") === "purple" ? "border-purple-300 text-purple-700" :
                            form.watch("theme") === "teal" ? "border-teal-300 text-teal-700" :
                            form.watch("theme") === "green" ? "border-green-300 text-green-700" :
                            form.watch("theme") === "dark" ? "border-gray-600 text-gray-200" :
                            form.watch("theme") === "light" ? "border-gray-300 text-gray-700" :
                            form.watch("theme") === "gradient" ? "border-purple-300 text-purple-700" :
                            "border-blue-300 text-blue-700" // default
                          }`}>
                            Button
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back: Details
              </Button>
              <Button onClick={() => setActiveTab("projects")}>
                Next: Projects
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Projects</CardTitle>
              <CardDescription>
                Add projects to showcase your best work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Selected Projects ({projects.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <PortfolioProjectCard 
                        key={project.id} 
                        project={project}
                        onDelete={handleRemoveProject}
                        onEdit={() => navigate(`/projects/edit/${project.id}`)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No Projects Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select projects from your existing projects or create new ones.
                  </p>
                </div>
              )}
              
              <div className="my-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Available Projects</h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading your projects...</p>
                  </div>
                ) : availableProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableProjects
                      .filter(p => !projects.some(selectedP => selectedP.id === p.id))
                      .map((project) => (
                        <Card key={project.id} className="h-full flex flex-col overflow-hidden">
                          {project.image && (
                            <div className="w-full h-36 overflow-hidden">
                              <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleAddProject(project.id)}
                            >
                              <Plus className="mr-2 h-4 w-4" /> Add to Portfolio
                            </Button>
                          </CardFooter>
                        </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      You don't have any projects yet. Create your first project to add to your portfolio.
                    </p>
                    <Button onClick={() => navigate("/projects/create")}>
                      <Plus className="mr-2 h-4 w-4" /> Create New Project
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("appearance")}>
                Back: Appearance
              </Button>
              <Button onClick={() => setActiveTab("skills")}>
                Next: Skills
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>
                Showcase your professional skills and proficiency levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Add New Skill</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Skill Name</label>
                      <Input 
                        placeholder="React, TypeScript, UI Design, etc."
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Skill Level</label>
                      <div className="flex items-center gap-4">
                        <Progress
                          value={newSkill.level}
                          className="flex-1"
                          size="md"
                          variant={
                            newSkill.level < 30 ? "info" :
                            newSkill.level < 60 ? "warning" :
                            newSkill.level < 85 ? "success" :
                            "premium"
                          }
                          showValue={true}
                        />
                        <Input 
                          type="number" 
                          className="w-20" 
                          min="10" 
                          max="100"
                          value={newSkill.level}
                          onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select 
                        value={newSkill.category}
                        onValueChange={(value) => setNewSkill({...newSkill, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="soft">Soft Skills</SelectItem>
                          <SelectItem value="language">Languages</SelectItem>
                          <SelectItem value="tools">Tools & Software</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleAddSkill}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Skill
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Your Skills ({skills.length})</h3>
                  {skills.length > 0 ? (
                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-3">
                          <Badge className={
                            skill.category === "technical" ? "bg-blue-500" :
                            skill.category === "design" ? "bg-purple-500" :
                            skill.category === "soft" ? "bg-green-500" :
                            skill.category === "language" ? "bg-amber-500" :
                            "bg-slate-500"
                          }>
                            {skill.category}
                          </Badge>
                          
                          <span className="min-w-28 text-sm font-medium">{skill.name}</span>
                          
                          <Progress
                            value={skill.level}
                            className="flex-1"
                            size="sm"
                            variant={
                              skill.level < 30 ? "info" :
                              skill.level < 60 ? "warning" :
                              skill.level < 85 ? "success" :
                              "premium"
                            }
                          />
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => skill.id && handleRemoveSkill(skill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-lg p-8 text-center">
                      <p className="text-muted-foreground">
                        Add skills to showcase your expertise
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("projects")}>
                Back: Projects
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Portfolio
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CTASection
        title="Elevate Your Online Presence"
        description="Your portfolio is the first impression potential clients will have of your work. Make it count with our professional portfolio builder."
        action={{
          text: "Generate Portfolio",
          href: "#",
          variant: "default"
        }}
        secondaryAction={{
          text: "Learn More",
          href: "#"
        }}
        className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl my-12"
      />
    </div>
  );
};

export default PortfolioGenerator;