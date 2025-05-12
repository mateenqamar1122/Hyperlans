
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, Edit, Link, Tag, Trash, Users, Upload, FileImage } from "lucide-react";
import { Project } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ProjectNotesTab from "./project/ProjectNotesTab";
import { ClientAccessCard } from "./project/ClientAccessCard";
import { ProjectClientDetail } from "./project/ProjectClientDetail";
import ImageUpload from "./ImageUpload";
import { updateProject } from "@/services/projectService";
import { toast } from "sonner";

interface ProjectDetailProps {
  project: Project;
  onEdit: () => void;
  onBack: () => void;
  onDeleted: () => void;
}

export default function ProjectDetail({ project, onEdit, onBack, onDeleted }: ProjectDetailProps) {
  const navigate = useNavigate();

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const handleBannerUploaded = async (url: string) => {
    try {
      await updateProject(project.id, { banner_url: url });
      toast.success("Project banner updated");
      // To refresh the banner in the UI without full page reload
      project.banner_url = url;
    } catch (error) {
      toast.error("Failed to update project banner");
      console.error("Error updating project banner:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <p className="text-muted-foreground">
              View project details and manage resources
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
          <Button variant="destructive" size="sm" onClick={() => {
            const confirmed = window.confirm("Are you sure you want to delete this project?");
            if (confirmed) {
              onDeleted();
              navigate('/projects');
            }
          }}>
            <Trash className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        </div>
      </div>
      
      {/* Project Banner */}
      <div className="relative rounded-lg overflow-hidden">
        {project.banner_url ? (
          <div 
            className="w-full h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.banner_url})` }}
          />
        ) : (
          <div className="w-full h-40 bg-muted flex flex-col items-center justify-center">
            <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No banner image set</p>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <ImageUpload 
            onImageUploaded={handleBannerUploaded}
            bucket="project_banners"
            title="Upload Project Banner"
            description="Choose an image to represent this project"
            aspectRatio="16/9"
            buttonText="Change Banner"
            buttonVariant="default"
            maxSizeMB={5}
          />
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="clients">Client Access</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium">Category</div>
                <div className="text-muted-foreground">
                  {project.category || "No category set"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Category</div>
                <div className="text-muted-foreground">
                  {project.category || "No category set"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Start Date</div>
                <div className="text-muted-foreground">
                  {formatDate(project.start_date)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Deadline</div>
                <div className="text-muted-foreground">
                  {formatDate(project.deadline)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Budget</div>
                <div className="text-muted-foreground">
                  {project.budget ? `$${project.budget}` : "No budget set"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Status</div>
                <div>
                  <Badge variant={getStatusBadgeVariant(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Priority</div>
                <div className="text-muted-foreground">
                  {project.priority}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Tags</div>
                <div className="text-muted-foreground">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="mr-1">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    "No tags set"
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              {project.description || "No description provided"}
            </CardContent>
          </Card>

          <ProjectClientDetail project={project} />

          <Card>
            <CardHeader>
              <CardTitle>Manager Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {project.manager_notes || "No notes provided"}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
            </CardHeader>
            <CardContent>
              {project.team && project.team.length > 0 ? (
                <ul className="list-none space-y-2">
                  {project.team.map((member: any) => (
                    <li key={member.id} className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {member.name} ({member.project_role || 'Team Member'})
                    </li>
                  ))}
                </ul>
              ) : (
                "No team members assigned to this project."
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <ProjectNotesTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ClientAccessCard projectId={project.id} project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
