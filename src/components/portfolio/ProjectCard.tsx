
import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioProject } from "@/types/portfolio";
import { useToast } from "@/components/ui/use-toast";
import { deletePortfolioProject } from "@/services/portfolioProjectsService";
import { ExternalLink, Github, Star, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ProjectCardProps {
  project: PortfolioProject;
  onEdit: (project: PortfolioProject) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const handleDelete = async () => {
    if (!project.id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deletePortfolioProject(project.id);
      
      if (success) {
        toast({
          title: "Project deleted",
          description: `${project.title} has been removed.`,
        });
        onDelete(project.id);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2 relative">
        {project.featured && (
          <div className="absolute top-2 right-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        )}
        {project.image_url && (
          <div className="w-full h-48 rounded-md mb-4 overflow-hidden">
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.client}</p>
          {(project.start_date || project.completion_date) && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="inline-block mr-1 h-3 w-3" />
              {project.start_date && formatDate(project.start_date)}
              {project.start_date && project.completion_date && " - "}
              {project.completion_date && formatDate(project.completion_date)}
            </div>
          )}
        </div>
        {project.type && (
          <Badge variant="outline" className="mt-2">
            {project.type}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {project.description && <p className="text-sm mb-4">{project.description}</p>}
        
        {(project.technologies && project.technologies.length > 0) && (
          <div className="mb-3">
            <p className="text-xs font-medium mb-1">Technologies</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {(project.tags && project.tags.length > 0) && (
          <div>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-2 items-stretch">
        <div className="flex gap-2 justify-center w-full">
          {project.url && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" /> View
              </a>
            </Button>
          )}
          
          {project.github_url && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" /> Code
              </a>
            </Button>
          )}
        </div>
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(project)}>
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex-1 ml-2"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
