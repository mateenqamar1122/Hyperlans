
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TeamMember, SocialLink } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";

const teamMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role is required." }),
  bio: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal('')),
  avatarUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal(''))
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

type TeamMemberFormProps = {
  initialData?: TeamMember;
  onSubmit: (data: TeamMember) => void;
  onCancel: () => void;
};

const TeamMemberForm = ({ initialData, onSubmit, onCancel }: TeamMemberFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialData?.socialLinks || []);
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);
  const [currentSocialLink, setCurrentSocialLink] = useState<SocialLink>({
    id: "",
    platform: "",
    url: ""
  });
  const [isEditingSocialLink, setIsEditingSocialLink] = useState(false);
  
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: initialData?.name || "",
      role: initialData?.role || "",
      bio: initialData?.bio || "",
      email: initialData?.email || "",
      avatarUrl: initialData?.avatarUrl || ""
    }
  });

  const handleSocialLinkSubmit = () => {
    if (!currentSocialLink.platform || !currentSocialLink.url) {
      return;
    }

    if (isEditingSocialLink) {
      // Update existing social link
      setSocialLinks(socialLinks.map(link => 
        link.id === currentSocialLink.id ? currentSocialLink : link
      ));
    } else {
      // Add new social link
      setSocialLinks([...socialLinks, {
        ...currentSocialLink,
        id: uuidv4()
      }]);
    }
    
    // Reset form and close dialog
    setCurrentSocialLink({
      id: "",
      platform: "",
      url: ""
    });
    setIsEditingSocialLink(false);
    setIsSocialLinkDialogOpen(false);
  };

  const handleEditSocialLink = (link: SocialLink) => {
    setCurrentSocialLink(link);
    setIsEditingSocialLink(true);
    setIsSocialLinkDialogOpen(true);
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const handleFormSubmit = async (values: TeamMemberFormValues) => {
    setIsSubmitting(true);
    try {
      const teamMemberData: TeamMember = {
        id: initialData?.id || uuidv4(),
        name: values.name,
        role: values.role,
        bio: values.bio,
        email: values.email,
        avatarUrl: values.avatarUrl,
        socialLinks
      };
      
      onSubmit(teamMemberData);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to profile picture
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief biography of the team member..." 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <FormLabel>Social Media Links</FormLabel>
            <Dialog open={isSocialLinkDialogOpen} onOpenChange={setIsSocialLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCurrentSocialLink({
                      id: "",
                      platform: "",
                      url: ""
                    });
                    setIsEditingSocialLink(false);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditingSocialLink ? "Edit Social Link" : "Add Social Link"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <FormLabel>Platform</FormLabel>
                    <Input 
                      placeholder="LinkedIn, Twitter, GitHub, etc."
                      value={currentSocialLink.platform}
                      onChange={(e) => setCurrentSocialLink({
                        ...currentSocialLink,
                        platform: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>URL</FormLabel>
                    <Input 
                      placeholder="https://linkedin.com/in/username"
                      value={currentSocialLink.url}
                      onChange={(e) => setCurrentSocialLink({
                        ...currentSocialLink,
                        url: e.target.value
                      })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSocialLinkDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSocialLinkSubmit}
                  >
                    {isEditingSocialLink ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-md p-4">
            {socialLinks.length > 0 ? (
              <div className="space-y-2">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div>
                      <span className="font-medium">{link.platform}</span>
                      <br/>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSocialLink(link)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSocialLink(link.id || "")}
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No social links added yet
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-brand-magenta hover:bg-brand-magenta/90 text-white">
            {isSubmitting ? 'Saving...' : initialData ? 'Update Team Member' : 'Add Team Member'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamMemberForm;
