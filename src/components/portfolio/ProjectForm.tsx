
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PortfolioProject } from "@/types/portfolio";
import { createPortfolioProject, updatePortfolioProject } from "@/services/portfolioProjectsService";
import { CalendarIcon, X, Upload, Link, Image, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  title: z.string().min(2, { message: "Project title must be at least 2 characters" }),
  description: z.string().optional(),
  client: z.string().min(1, { message: "Client name is required" }),
  image_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  type: z.string().optional(),
  status: z.string().optional(),
  start_date: z.date().optional().nullable(),
  completion_date: z.date().optional().nullable(),
  testimonial: z.string().optional(),
  features: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProjectFormProps {
  portfolioId: string;
  project?: PortfolioProject;
  onSave: (project: PortfolioProject) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  portfolioId,
  project,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(project?.id);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("url");

  // Parse dates from strings if they exist
  const parseDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      client: project?.client || "",
      image_url: project?.image_url || "",
      tags: project?.tags || [],
      technologies: project?.technologies || [],
      featured: project?.featured || false,
      url: project?.url || "",
      github_url: project?.github_url || "",
      type: project?.type || "",
      status: project?.status || "",
      start_date: parseDate(project?.start_date) || null,
      completion_date: parseDate(project?.completion_date) || null,
      testimonial: project?.testimonial || "",
      features: project?.features || "",
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    );
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      const currentTech = form.getValues("technologies") || [];
      if (!currentTech.includes(techInput.trim())) {
        form.setValue("technologies", [...currentTech, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    const currentTech = form.getValues("technologies") || [];
    form.setValue(
      "technologies",
      currentTech.filter((t) => t !== tech)
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImagePreview(e.target.result as string);
          setActiveTab("upload");
          // Clear the URL input when uploading an image
          form.setValue("image_url", "");
        }
      };
      reader.readAsDataURL(file);
      
      setUploadedImage(file);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "url") {
      setUploadedImage(null);
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      let imageUrl = data.image_url;

      // If there's an uploaded image, upload it to storage before creating/updating
      if (uploadedImage) {
        // Here we would handle uploading the file to a storage service
        // For now, we'll simulate this by creating a fake URL
        // In a real app, you would use your storage service (e.g., Supabase Storage)
        try {
          // Example for Supabase storage upload:
          const filename = `project-images/${portfolioId}/${Date.now()}-${uploadedImage.name}`;
          
          const { data: uploadData, error } = await supabase.storage
            .from("portfolios")
            .upload(filename, uploadedImage);
            
          if (error) throw error;
          
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from("portfolios")
            .getPublicUrl(filename);
            
          imageUrl = publicUrlData.publicUrl;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Using URL instead if provided.",
            variant: "destructive",
          });
        }
      }

      // Format dates for API
      const formattedData = {
        ...data,
        image_url: imageUrl,
        start_date: data.start_date ? format(data.start_date, "yyyy-MM-dd") : null,
        completion_date: data.completion_date ? format(data.completion_date, "yyyy-MM-dd") : null,
        portfolio_id: portfolioId,
      };

      let result;
      
      if (isEditing && project?.id) {
        result = await updatePortfolioProject({
          ...formattedData,
          id: project.id,
        });
      } else {
        result = await createPortfolioProject(formattedData);
      }

      if (result) {
        toast({
          title: isEditing ? "Project updated" : "Project added",
          description: `${result.title} has been ${isEditing ? "updated" : "added"} successfully.`,
        });
        onSave(result);
      } else {
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "add"} project.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} project:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} project.`,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., E-Commerce Website Redesign" {...field} />
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
              <FormLabel>Client/Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the project, its goals, and your contribution..."
                  className="resize-y min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Project Image</FormLabel>
          <div className="mt-2">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="url" className="flex items-center gap-1">
                  <Link className="h-4 w-4" /> URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-1">
                  <Upload className="h-4 w-4" /> Upload
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="mt-0">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <div className="mt-2 relative rounded-md overflow-hidden border w-full max-w-xs">
                          <img 
                            src={field.value} 
                            alt="Project preview" 
                            className="w-full h-auto object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                            }}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="upload" className="mt-0">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <div className="space-y-2 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-4 relative rounded-md overflow-hidden border w-full max-w-xs">
                      <img 
                        src={imagePreview} 
                        alt="Upload preview" 
                        className="w-full h-auto object-cover" 
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          setUploadedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Web Development, Design, Mobile App" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Links</FormLabel>
            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Live project URL" 
                        className="pl-8"
                        {...field} 
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <svg 
                        viewBox="0 0 24 24" 
                        className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      <Input 
                        placeholder="GitHub repository URL" 
                        className="pl-8"
                        {...field} 
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="completion_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Completion Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() ||
                        date < new Date("1900-01-01") ||
                        (form.getValues("start_date") &&
                          date < form.getValues("start_date"))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Tags</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.getValues("tags")?.map((tag) => (
                <Badge key={tag} className="gap-1 items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>

          <div>
            <FormLabel>Technologies</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.getValues("technologies")?.map((tech) => (
                <Badge key={tech} variant="secondary" className="gap-1 items-center">
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="ml-1 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a technology"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTech}>
                Add
              </Button>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Features (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the main features or components of your project..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="testimonial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Testimonial (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a testimonial from your client about this project..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Feature this project</FormLabel>
                <FormDescription>
                  Featured projects will be displayed prominently on your portfolio
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
