
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createPortfolioService, updatePortfolioService } from "@/services/portfolioServicesService";
import { PortfolioService } from "@/types/portfolio";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().optional(),
  icon: z.string().optional(),
  is_featured: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface ServiceFormProps {
  portfolioId: string;
  service?: PortfolioService;
  onSave: (service: PortfolioService) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ portfolioId, service, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: service?.title || "",
      description: service?.description || "",
      price: service?.price || "",
      icon: service?.icon || "",
      is_featured: service?.is_featured || false,
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      if (service?.id) {
        // Update existing service
        const updatedService = await updatePortfolioService({
          id: service.id,
          portfolio_id: portfolioId,
          ...data,
        });
        
        if (updatedService) {
          toast({
            title: "Service updated",
            description: "Your service has been updated successfully.",
          });
          onSave(updatedService);
        }
      } else {
        // Create new service
        const newService = await createPortfolioService({
          portfolio_id: portfolioId,
          ...data,
        });
        
        if (newService) {
          toast({
            title: "Service added",
            description: "Your service has been added successfully.",
          });
          onSave(newService);
        }
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: "Error",
        description: "Failed to save service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Title</FormLabel>
              <FormControl>
                <Input placeholder="Web Development" {...field} />
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
                  placeholder="Describe the service you provide..."
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="$50/hr or Starting at $500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured Service</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Mark this as a featured service to highlight it on your portfolio
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : service?.id ? "Update Service" : "Add Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
