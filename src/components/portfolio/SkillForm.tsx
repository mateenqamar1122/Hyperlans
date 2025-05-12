
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skill } from "@/types/portfolio";
import { createSkill, updateSkill } from "@/services/portfolioSkillsService";

const formSchema = z.object({
  name: z.string().min(2, { message: "Skill name must be at least 2 characters" }),
  level: z.number().min(0).max(100),
  category: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface SkillFormProps {
  portfolioId: string;
  skill?: Skill;
  onSave: (skill: Skill) => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({
  portfolioId,
  skill,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(skill?.id);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: skill?.name || "",
      level: skill?.level || 50,
      category: skill?.category || "technical",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      let result;
      
      if (isEditing && skill?.id) {
        result = await updateSkill({
          ...data,
          id: skill.id,
          portfolio_id: portfolioId,
        });
      } else {
        result = await createSkill({
          ...data,
          portfolio_id: portfolioId,
        });
      }

      if (result) {
        toast({
          title: isEditing ? "Skill updated" : "Skill added",
          description: `${result.name} has been ${isEditing ? "updated" : "added"} successfully.`,
        });
        onSave(result);
      } else {
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "add"} skill.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} skill:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} skill.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React, JavaScript, UI Design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="soft">Soft Skills</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="tool">Tools & Software</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proficiency Level: {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  defaultValue={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Skill" : "Add Skill"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SkillForm;
