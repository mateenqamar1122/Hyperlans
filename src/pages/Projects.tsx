import { useState, useEffect } from "react";
import { 
  LayoutGrid, 
  PlusCircle, 
  Search, 
  MoreHorizontal, 
  Edit,
  Trash, 
  Calendar,
  Users,
  Tag,
  ArrowUpRight,
  Clock,
  Filter,
  Building,
  ChevronLeft,
  Layers,
  BarChart3,
  Grid3x3,
  LineChart
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/database";
import { getProjects, createProject, getProjectById, deleteProject, updateProject } from "@/services/projectService";
import ProjectForm from "@/components/ProjectForm";
import ProjectDetail from "@/components/ProjectDetail";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "kanban">("cards");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (projectData: any) => {
    try {
      const teamIds = projectData.team_members || [];
      delete projectData.team_members;

      const newProject = await createProject(projectData, teamIds);
      if (newProject) {
        setProjects([newProject, ...projects]);
        setIsAddProjectOpen(false);
        toast.success("Project created successfully");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  const handleEditProject = async (projectData: any) => {
    if (!selectedProject) return;
    
    try {
      const teamIds = projectData.team_members || [];
      delete projectData.team_members;

      await updateProject(
        selectedProject.id, 
        projectData,
        teamIds
      );
      
      loadProjects();
      setIsEditProjectOpen(false);
      toast.success("Project updated successfully");
      
      if (isDetailView) {
        const updatedProject = await getProjectById(selectedProject.id);
        if (updatedProject) {
          setSelectedProject(updatedProject);
        }
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const success = await deleteProject(id);
      if (success) {
        setProjects(projects.filter(project => project.id !== id));
        toast.success("Project deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleViewProjectDetail = async (project: Project) => {
    try {
      const detailedProject = await getProjectById(project.id);
      if (detailedProject) {
        setSelectedProject(detailedProject);
        setIsDetailView(true);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to load project details");
    }
  };

  const filteredProjects = projects.filter(project => 
    (searchQuery === "" || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client?.name && project.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    (statusFilter === "all" || project.status === statusFilter)
  );

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "pending": return "secondary";
      case "in-progress": return "cyan";
      case "completed": return "blue";
      case "on-hold": return "magenta";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-amber-500";
    if (progress < 75) return "bg-blue-500";
    if (progress === 100) return "bg-purple-500";
    return "bg-emerald-500";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const getStatusGroups = () => {
    const groups = {
      "pending": filteredProjects.filter(p => p.status === "pending"),
      "in-progress": filteredProjects.filter(p => p.status === "in-progress"),
      "on-hold": filteredProjects.filter(p => p.status === "on-hold"),
      "completed": filteredProjects.filter(p => p.status === "completed"),
      "cancelled": filteredProjects.filter(p => p.status === "cancelled")
    };
    return groups;
  };

  const renderProjectCard = (project: Project) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={project.id}
    >
      <Card 
        className="overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer group bg-gradient-to-br from-background to-background/50"
        onClick={() => handleViewProjectDetail(project)}
      >
        <CardHeader className="pb-2 relative">
          <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-300"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors duration-200">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" />
                {project.client?.name || "No client"}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(project);
                  setIsEditProjectOpen(true);
                }}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getProgressColor(project.progress)} transition-all duration-500 ease-out`} 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center text-muted-foreground mb-1">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                <span className="text-xs">Deadline</span>
              </div>
              <p className="font-medium">{formatDate(project.deadline)}</p>
            </div>
            <div>
              <div className="flex items-center text-muted-foreground mb-1">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                <span className="text-xs">Team</span>
              </div>
              <p className="font-medium">
                {project.teamCount || (project.team && project.team.length) || 0} members
              </p>
            </div>
            <div>
              <div className="flex items-center text-muted-foreground mb-1">
                <Tag className="mr-1.5 h-3.5 w-3.5" />
                <span className="text-xs">Category</span>
              </div>
              <p className="font-medium">{project.category || "Not set"}</p>
            </div>
            <div>
              <div className="flex items-center text-muted-foreground mb-1">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                <span className="text-xs">Status</span>
              </div>
              <Badge variant={getStatusBadgeVariant(project.status)} className="font-normal text-xs px-1.5 py-0.5">
                {project.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewProjectDetail(project);
            }}
          >
            <span>View Details</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const renderKanbanView = () => {
    const statusGroups = getStatusGroups();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(statusGroups).map(([status, projectList]) => (
          <div key={status} className="min-w-[280px]">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant={getStatusBadgeVariant(status)} className="text-xs px-2 py-1">
                {status.replace('-', ' ')}
              </Badge>
              <span className="text-xs font-medium">{projectList.length} projects</span>
            </div>
            <div className="space-y-3">
              {projectList.map(project => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:border-primary/50 transition-all duration-200"
                  onClick={() => handleViewProjectDetail(project)}
                >
                  <CardHeader className="p-3 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm line-clamp-1">{project.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            setIsEditProjectOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${getProgressColor(project.progress)}`} 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(project.deadline)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {projectList.length === 0 && (
                <div className="p-4 text-center border border-dashed rounded-lg text-muted-foreground">
                  <p className="text-sm">No projects</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isDetailView && selectedProject) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ProjectDetail
          project={selectedProject}
          onEdit={() => setIsEditProjectOpen(true)}
          onBack={() => setIsDetailView(false)}
          onDeleted={() => {
            setIsDetailView(false);
            loadProjects();
          }}
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Projects</h2>
          <p className="text-muted-foreground">
            Manage your ongoing projects and their progress
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 md:min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 border-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "cards" | "table" | "kanban")} className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="cards" className="flex items-center gap-1.5">
                <Grid3x3 className="h-3.5 w-3.5" />
                <span>Cards</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Table</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                <span>Kanban</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <Button 
              className="gap-1 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg" 
              onClick={() => setIsAddProjectOpen(true)}
            >
              <PlusCircle className="size-4" />
              <span className="hidden sm:inline">Add Project</span>
            </Button>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Enter the details of the new project to add it to your portfolio.
                </DialogDescription>
              </DialogHeader>
              <ProjectForm 
                onSubmit={handleAddProject}
                onCancel={() => setIsAddProjectOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="h-6 w-2/3 bg-secondary rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-secondary rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="h-4 w-full bg-secondary rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-secondary rounded animate-pulse"></div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="h-8 w-full bg-secondary rounded animate-pulse"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : viewMode === "cards" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map(renderProjectCard)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <LayoutGrid className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "We couldn't find any projects matching your filters."
                  : "Get started by adding your first project."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button 
                  onClick={() => setIsAddProjectOpen(true)} 
                  className="mt-4 bg-gradient-to-r from-primary to-purple-500"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              )}
            </div>
          )}
        </motion.div>
      ) : viewMode === "kanban" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderKanbanView()}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-secondary shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50 dark:to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-primary" />
                    Project List
                  </CardTitle>
                  <CardDescription>A comprehensive view of all your projects</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredProjects.length} projects
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {filteredProjects.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Client</th>
                        <th className="text-left py-3 px-4 font-medium">Deadline</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Progress</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr 
                          key={project.id} 
                          className="border-b hover:bg-muted/50 cursor-pointer transition-colors" 
                          onClick={() => handleViewProjectDetail(project)}
                        >
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{project.name}</div>
                              {project.category && (
                                <div className="text-xs text-muted-foreground">{project.category}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {project.client ? (
                                <>
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span>{project.client.name}</span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {project.deadline ? formatDate(project.deadline) : "Not set"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusBadgeVariant(project.status)}>
                              {project.status.replace('-', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 min-w-[150px]">
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-xs">
                                <span>{project.progress}%</span>
                              </div>
                              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${getProgressColor(project.progress)} transition-all duration-500`} 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProjectDetail(project);
                                  setIsEditProjectOpen(true);
                                }}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProject(project.id);
                                  }}
                                  className="text-red-500 focus:text-red-500"
                                >
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <LayoutGrid className="h-12 w-12 text-muted-foreground opacity-40" />
                    <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchQuery || statusFilter !== "all" 
                        ? "We couldn't find any projects matching your filters."
                        : "Get started by adding your first project."}
                    </p>
                    {!searchQuery && statusFilter === "all" && (
                      <Button 
                        onClick={() => setIsAddProjectOpen(true)} 
                        className="mt-4 bg-gradient-to-r from-primary to-purple-500"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Project
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project's information.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm 
              initialData={selectedProject}
              onSubmit={handleEditProject}
              onCancel={() => setIsEditProjectOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;