
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Plus, 
  Search, 
  Link as LinkIcon, 
  Github, 
  Calendar, 
  Clock,
  Edit,
  Trash,
  MoreHorizontal,
  Image as ImageIcon,
  Sparkles,
  FileSpreadsheet
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import { DbPortfolioProject } from "@/types/portfolio";
import PortfolioForm from "@/components/PortfolioForm";
import { 
  getPortfolioProjects, 
  createPortfolioProject, 
  updatePortfolioProject, 
  deletePortfolioProject 
} from "@/services/portfolioProjectsService";
import { Link, useNavigate } from "react-router-dom";
import { LucideFeather } from "lucide-react";

const Portfolio = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DbPortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DbPortfolioProject | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getPortfolioProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading portfolio projects:", error);
      toast.error("Failed to load portfolio projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (projectData: Omit<DbPortfolioProject, "id" | "created_at" | "updated_at">) => {
    try {
      const newProject = await createPortfolioProject(projectData);
      if (newProject) {
        setProjects([newProject, ...projects]);
        setIsAddProjectOpen(false);
        toast.success("Project added successfully!");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  const handleEditProject = async (projectData: Partial<DbPortfolioProject>) => {
    if (!selectedProject) return;
    
    try {
      const updatedProject = await updatePortfolioProject(selectedProject.id, projectData);
      if (updatedProject) {
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        setIsEditProjectOpen(false);
        toast.success("Project updated successfully!");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deletePortfolioProject(projectToDelete);
      if (success) {
        setProjects(projects.filter(p => p.id !== projectToDelete));
        toast.success("Project deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
      setProjectToDelete(null);
    }
  };

  const navigateToPortfolioGenerator = () => {
    navigate('/portfolio-generator');
  };

  const filteredProjects = projects.filter(project => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Type filter
    const matchesType = 
      typeFilter === "all" || 
      (project.type && project.type === typeFilter);
    
    // Status filter
    const matchesStatus = 
      statusFilter === "all" || 
      project.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const availableTypes = Array.from(new Set(projects.filter(p => p.type).map(p => p.type)));

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <Button className="bg-brand-magenta hover:bg-brand-magenta/90 text-white">
          <Link to="/portfolio-generator" className="flex items-center">
            <LucideFeather className="mr-2 h-4 w-4" />
            Generate Portfolio
          </Link>
        </Button>
      </div> */}

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground">
            Showcase and manage your projects
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 md:min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            variant="default" 
            className="gap-2 bg-brand-magenta hover:bg-brand-magenta/90"
            onClick={navigateToPortfolioGenerator}
          >
            <Sparkles className="h-4 w-4" />
            Generate Portfolio
          </Button>
          
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {availableTypes.map(type => (
                <SelectItem key={type} value={type || ""}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <Button onClick={() => setIsAddProjectOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add Portfolio Project</DialogTitle>
                <DialogDescription>
                  Add a new project to your portfolio showcase.
                </DialogDescription>
              </DialogHeader>
              <PortfolioForm
                onSubmit={handleAddProject}
                onCancel={() => setIsAddProjectOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardHeader>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No portfolio projects found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "We couldn't find any projects matching your filters."
                  : "Get started by adding your first portfolio project."}
              </p>
              {!searchQuery && typeFilter === "all" && statusFilter === "all" && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => setIsAddProjectOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Project
                  </Button>
                  <Link to="/portfolio-generator">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Use Portfolio Generator
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <Card key={project.id} className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedProject(project);
                            setIsEditProjectOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setProjectToDelete(project.id);
                            setConfirmDelete(true);
                          }}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {project.is_featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        {project.client}
                        {project.type && (
                          <Badge variant="outline" className="ml-2">
                            {project.type}
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.slice(0, 3).map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t p-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {project.completion_date 
                        ? format(new Date(project.completion_date), 'MMM yyyy')
                        : 'In progress'}
                    </div>
                    <div className="flex items-center gap-2">
                      {project.url && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Projects</CardTitle>
                <CardDescription>A list of all your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Project</th>
                        <th className="text-left py-3 px-4 font-medium">Client</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Technologies</th>
                        <th className="text-left py-3 px-4 font-medium">Dates</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(project => (
                        <tr key={project.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                                {project.image_url ? (
                                  <img 
                                    src={project.image_url} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{project.title}</div>
                                {project.is_featured && (
                                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs mt-1">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{project.client}</td>
                          <td className="py-3 px-4 text-muted-foreground">{project.type || "-"}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                project.status === "completed" ? "blue" : 
                                project.status === "in-progress" ? "cyan" : 
                                project.status === "on-hold" ? "magenta" : 
                                "secondary"
                              }
                            >
                              {project.status.replace("-", " ")}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {project.technologies && project.technologies.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {project.technologies.slice(0, 2).map(tech => (
                                  <Badge key={tech} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                                {project.technologies.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{project.technologies.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col text-xs">
                              {project.start_date && (
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" /> 
                                  Started: {format(new Date(project.start_date), 'MMM d, yyyy')}
                                </div>
                              )}
                              {project.completion_date && (
                                <div className="flex items-center text-muted-foreground mt-1">
                                  <CheckIcon className="h-3 w-3 mr-1" /> 
                                  Completed: {format(new Date(project.completion_date), 'MMM d, yyyy')}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedProject(project);
                                    setIsEditProjectOpen(true);
                                  }}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setProjectToDelete(project.id);
                                    setConfirmDelete(true);
                                  }}>
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Project</DialogTitle>
            <DialogDescription>
              Update the details of your portfolio project.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <PortfolioForm 
              initialData={selectedProject}
              onSubmit={handleEditProject}
              onCancel={() => setIsEditProjectOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProject}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default Portfolio;