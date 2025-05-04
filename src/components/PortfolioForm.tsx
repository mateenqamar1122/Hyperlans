
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DbPortfolioProject } from "@/types/portfolio";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

const projectSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  client: z.string().min(2, { message: "Client name is required" }),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.string().default("in-progress"),
  image_url: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  start_date: z.string().optional(),
  completion_date: z.string().optional(),
  url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  github_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type PortfolioFormProps = {
  initialData?: DbPortfolioProject;
  onSubmit: (data: ProjectFormValues) => void;
  onCancel: () => void;
};

const PortfolioForm = ({ initialData, onSubmit, onCancel }: PortfolioFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techList, setTechList] = useState<string[]>(initialData?.technologies || []);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      client: initialData?.client || "",
      description: initialData?.description || "",
      type: initialData?.type || "",
      status: initialData?.status || "in-progress",
      image_url: initialData?.image_url || "",
      technologies: initialData?.technologies || [],
      start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "",
      completion_date: initialData?.completion_date ? new Date(initialData.completion_date).toISOString().split('T')[0] : "",
      url: initialData?.url || "",
      github_url: initialData?.github_url || "",
      is_featured: initialData?.is_featured || false,
    }
  });

  const handleAddTech = () => {
    if (techInput.trim() && !techList.includes(techInput.trim())) {
      setTechList([...techList, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechList(techList.filter(t => t !== tech));
  };

  const handleFormSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      // Add the tech list to the form values
      const formData = {
        ...values,
        technologies: techList,
        featured: values.is_featured // Map is_featured to featured for consistency
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="E-commerce Website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <FormControl>
                    <Input placeholder="Client Name or Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to an image that showcases your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                        <SelectItem value="web-app">Web Application</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="branding">Branding</SelectItem>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "in-progress"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="completion_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://project-website.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repository</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <div className="flex gap-2 items-center">
                <Input 
                  placeholder="React, Node.js, etc."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTech} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {techList.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="py-1 px-2">
                    {tech}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                      onClick={() => handleRemoveTech(tech)}
                    />
                  </Badge>
                ))}
                {techList.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No technologies added yet
                  </div>
                )}
              </div>
            </FormItem>
            
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Project</FormLabel>
                    <FormDescription>
                      Mark this project to be highlighted in your portfolio
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project in detail..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-brand-magenta hover:bg-brand-magenta/90 text-white">
            {isSubmitting ? 'Saving...' : initialData ? 'Update Project' : 'Add Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PortfolioForm;
