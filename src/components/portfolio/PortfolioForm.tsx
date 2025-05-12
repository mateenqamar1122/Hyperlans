
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Portfolio } from "@/types/portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePortfolio } from "@/services/portfolioService";
import ImageUpload from "@/components/ImageUpload";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  subtitle: z.string().optional(),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  theme: z.string(),
  contact: z.object({
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface PortfolioFormProps {
  portfolio: Portfolio | null;
  onUpdate?: (portfolio: Portfolio) => void;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ portfolio, onUpdate }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(portfolio?.logo_url);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(portfolio?.banner_url);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: portfolio?.name || "",
      title: portfolio?.title || "",
      subtitle: portfolio?.subtitle || "",
      bio: portfolio?.bio || "",
      theme: portfolio?.theme || "modern",
      contact: {
        email: portfolio?.contact?.email || "",
        phone: portfolio?.contact?.phone || "",
        website: portfolio?.contact?.website || "",
        linkedin: portfolio?.contact?.linkedin || "",
        twitter: portfolio?.contact?.twitter || "",
        github: portfolio?.contact?.github || "",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!portfolio) return;
    
    setIsLoading(true);
    
    try {
      const updatedPortfolio = await updatePortfolio({
        ...data,
        id: portfolio.id,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        layout: portfolio.layout, // Keep existing layout
      });
      
      if (updatedPortfolio) {
        toast({
          title: "Portfolio updated",
          description: "Your portfolio has been successfully updated.",
        });
        
        if (onUpdate) {
          onUpdate(updatedPortfolio);
        }
      } else {
        toast({
          title: "Update failed",
          description: "There was an error updating your portfolio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your portfolio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUploaded = (url: string) => {
    setLogoUrl(url);
    toast({
      title: "Logo uploaded",
      description: "Your logo has been uploaded successfully.",
    });
  };

  const handleBannerUploaded = (url: string) => {
    setBannerUrl(url);
    toast({
      title: "Banner uploaded",
      description: "Your banner has been uploaded successfully.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Professional Portfolio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Stack Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Creating digital solutions for modern businesses" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio / About Me</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself, your expertise, and what you offer..." 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <FormField
              control={form.control}
              name="contact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="your-linkedin-profile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="your-twitter-handle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact.github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="your-github-username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Profile Logo</h3>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    {logoUrl ? (
                      <AvatarImage src={logoUrl} alt="Profile Logo" />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {portfolio?.name?.charAt(0) || "P"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <ImageUpload 
                    onImageUploaded={handleLogoUploaded}
                    bucket="portfolio"
                    folder="logos"
                    title="Upload Logo"
                    description="Upload your professional logo or profile picture"
                    aspectRatio="1/1"
                    buttonText="Upload Logo"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended size: 256x256px, square format
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Banner Image</h3>
                <div className="space-y-3">
                  {bannerUrl && (
                    <div className="relative w-full h-32 overflow-hidden rounded-md">
                      <img 
                        src={bannerUrl} 
                        alt="Banner" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <ImageUpload 
                    onImageUploaded={handleBannerUploaded}
                    bucket="portfolio"
                    folder="banners"
                    title="Upload Banner"
                    description="Upload a banner image for your portfolio"
                    aspectRatio="3/1"
                    buttonText={bannerUrl ? "Change Banner" : "Upload Banner"}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended size: 1200x400px, wide format
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default PortfolioForm;
