
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Experience } from "@/types/portfolio";
import { createExperience, updateExperience } from "@/services/portfolioExperiencesService";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, { message: "Job title must be at least 2 characters" }),
  company: z.string().min(1, { message: "Company name is required" }),
  location: z.string().optional(),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ExperienceFormProps {
  portfolioId: string;
  experience?: Experience;
  onSave: (experience: Experience) => void;
  onCancel: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  portfolioId,
  experience,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(experience?.id);

  // Parse dates from strings if they exist
  const parseDate = (dateString?: string) => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: experience?.title || "",
      company: experience?.company || "",
      location: experience?.location || "",
      start_date: parseDate(experience?.start_date) || new Date(),
      end_date: parseDate(experience?.end_date) || null,
      current: experience?.current || false,
      description: experience?.description || "",
    },
  });

  // Watch current field to disable end date when checked
  const watchCurrent = form.watch("current");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    // Format dates for API
    const formattedData = {
      ...data,
      start_date: format(data.start_date, "yyyy-MM-dd"),
      end_date: data.current ? null : data.end_date ? format(data.end_date, "yyyy-MM-dd") : null,
      portfolio_id: portfolioId,
    };

    try {
      let result;
      
      if (isEditing && experience?.id) {
        result = await updateExperience({
          ...formattedData,
          id: experience.id,
        });
      } else {
        result = await createExperience(formattedData);
      }

      if (result) {
        toast({
          title: isEditing ? "Experience updated" : "Experience added",
          description: `Your experience at ${result.company} has been ${isEditing ? "updated" : "added"} successfully.`,
        });
        onSave(result);
      } else {
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "add"} experience.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} experience:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} experience.`,
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
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New York, NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
                      selected={field.value}
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
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={watchCurrent}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{watchCurrent ? "Present" : "Pick a date"}</span>
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

        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      form.setValue("end_date", null);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I currently work here</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your responsibilities and achievements..."
                  className="resize-y"
                  {...field}
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
            {isLoading ? "Saving..." : isEditing ? "Update Experience" : "Add Experience"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExperienceForm;
