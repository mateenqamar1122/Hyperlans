
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skill } from "@/types/portfolio";
import { useToast } from "@/components/ui/use-toast";
import { deleteSkill } from "@/services/portfolioSkillsService";

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical':
        return 'bg-blue-100';
      case 'design':
        return 'bg-purple-100';
      case 'soft':
        return 'bg-green-100';
      case 'language':
        return 'bg-yellow-100';
      case 'tool':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const handleDelete = async () => {
    if (!skill.id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteSkill(skill.id);
      
      if (success) {
        toast({
          title: "Skill deleted",
          description: `${skill.name} has been removed.`,
        });
        onDelete(skill.id);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete skill.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{skill.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(skill.category)} w-fit`}>
            {skill.category}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={skill.level} className="mb-3" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Beginner</span>
          <span>Proficient</span>
          <span>Expert</span>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => onEdit(skill)}>
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

export default SkillCard;
