
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types/portfolio";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { deleteExperience } from "@/services/portfolioExperiencesService";

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (experienceId: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleDelete = async () => {
    if (!experience.id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteExperience(experience.id);
      
      if (success) {
        toast({
          title: "Experience deleted",
          description: `Your experience at ${experience.company} has been removed.`,
        });
        onDelete(experience.id);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete experience.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{experience.title}</h3>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-muted-foreground">{experience.company}</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(experience.start_date)} - {experience.current ? "Present" : formatDate(experience.end_date)}
            </span>
          </div>
          {experience.location && (
            <span className="text-sm text-muted-foreground">{experience.location}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {experience.description && <p className="text-sm mb-4">{experience.description}</p>}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(experience)}>
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
