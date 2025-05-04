
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Star, Pencil, Trash2 } from "lucide-react";
import { DbPortfolioProject, PortfolioProject } from "@/types/portfolio";
import { Link } from "react-router-dom";

interface PortfolioProjectCardProps {
  project: PortfolioProject | DbPortfolioProject;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  showActions?: boolean;
}

export function PortfolioProjectCard({ project, onEdit, onDelete, showActions = true }: PortfolioProjectCardProps) {
  const isDbProject = 'image_url' in project;
  const imageUrl = isDbProject ? project.image_url : project.image || "";
  const technologies = isDbProject ? project.technologies || [] : project.technologies || [];
  const isFeatured = isDbProject ? project.is_featured : project.featured;
  const projectLink = isDbProject ? project.url : project.link;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group h-full flex flex-col">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-500/90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Star className="h-3 w-3" />
              Featured
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="flex-none">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            {'client' in project && project.client && <CardDescription>{project.client}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{project.description}</p>
        
        {technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {technologies.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
            {technologies.length > 4 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{technologies.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t pt-4 flex-none">
        <Button asChild variant="ghost" size="sm">
          <Link to={projectLink || '#'} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            View Project
          </Link>
        </Button>
        
        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onEdit(project.id)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onDelete(project.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}