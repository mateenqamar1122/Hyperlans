
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, TeamMember } from "@/types/database";
import { getClients, createClient } from "@/services/clientService";
import { getTeamMembers, createTeamMember } from "@/services/projectService";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, UserPlus, Building, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Client Form Schema
const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
});

// Team Member Form Schema
const teamMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
});

const projectSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  client_id: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.coerce.number().optional(),
  status: z.string().default("pending"),
  priority: z.string().default("medium"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  progress: z.coerce.number().min(0).max(100).default(0),
  manager_notes: z.string().optional(),
  team_members: z.array(z.string()).optional(),
});

type ProjectFormProps = {
  initialData?: Partial<Project>;
  onSubmit: (data: z.infer<typeof projectSchema>) => void;
  onCancel: () => void;
};

export default function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Array<{ id: string; name: string; company?: string | null }>>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [currentTags, setCurrentTags] = useState<string[]>(initialData?.tags || []);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isAddTeamMemberDialogOpen, setIsAddTeamMemberDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || "",
      client_id: initialData?.client_id || "",
      description: initialData?.description || "",
      start_date: initialData?.start_date || "",
      deadline: initialData?.deadline || "",
      budget: initialData?.budget || undefined,
      status: initialData?.status || "pending",
      priority: initialData?.priority || "medium",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      progress: initialData?.progress || 0,
      manager_notes: initialData?.manager_notes || "",
      team_members: initialData?.team?.map(member => member.id) || [],
    }
  });

  // Client form
  const clientForm = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      website: "",
      industry: "",
    }
  });

  // Team Member form
  const teamMemberForm = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
    }
  });

  useEffect(() => {
    loadClients();
    loadTeamMembers();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data.map(client => ({
      id: client.id,
      name: client.name,
      company: client.company
    })));
  };

  const loadTeamMembers = async () => {
    const data = await getTeamMembers();
    setTeamMembers(data);
  };

  const handleSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true);
    try {
      // Include the current tags list
      const dataWithTags = {
        ...values,
        tags: currentTags
      };
      await onSubmit(dataWithTags);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddClient = async (data: z.infer<typeof clientSchema>) => {
    try {
      // Create a complete client object with all required fields
      const clientData = {
        name: data.name,
        email: data.email || '',
        company: data.company,
        phone: data.phone,
        website: data.website,
        industry: data.industry,
        status: 'active',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        contact_name: '',
        contact_position: '',
        notes: ''
      };
      
      const result = await createClient(clientData);
      if (result) {
        toast.success("Client added successfully!");
        setIsAddClientDialogOpen(false);
        loadClients();
        
        // Select the newly created client
        form.setValue("client_id", result.id);
        
        // Reset the client form
        clientForm.reset();
      }
    } catch (error) {
      toast.error("Failed to add client");
      console.error("Error adding client:", error);
    }
  };

  const handleAddTeamMember = async (data: z.infer<typeof teamMemberSchema>) => {
    try {
      // Ensure required name field is provided
      if (!data.name) {
        toast.error("Team member name is required");
        return;
      }
      
      const teamMemberData = {
        name: data.name,
        role: data.role,
        email: data.email
      };
      
      const result = await createTeamMember(teamMemberData);
      if (result) {
        toast.success("Team member added successfully!");
        setIsAddTeamMemberDialogOpen(false);
        loadTeamMembers();
        
        // Select the newly created team member
        const currentTeamMembers = form.getValues("team_members") || [];
        form.setValue("team_members", [...currentTeamMembers, result.id]);
        
        // Reset the team member form
        teamMemberForm.reset();
      }
    } catch (error) {
      toast.error("Failed to add team member");
      console.error("Error adding team member:", error);
    }
  };

  const addTag = () => {
    if (tagInput && !currentTags.includes(tagInput)) {
      setCurrentTags([...currentTags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setCurrentTags(currentTags.filter(t => t !== tag));
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Website Redesign" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <div className="flex gap-2">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map(client => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name} {client.company ? `(${client.company})` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setIsAddClientDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Strategy">Strategy</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-3">
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
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
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
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1">
                      <FormLabel className="mb-0">Progress (%)</FormLabel>
                      <span className="text-sm text-muted-foreground">{field.value}%</span>
                    </div>
                    <FormControl>
                      <div className="space-y-2">
                        <Progress 
                          value={field.value} 
                          className="h-2" 
                          showValue={false} 
                          variant={
                            field.value < 25 ? "danger" : 
                            field.value < 50 ? "warning" : 
                            field.value < 75 ? "info" : "success"
                          }
                        />
                        <Input 
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          className="cursor-pointer"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add tag..." 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentTags.map(tag => (
                      <Badge key={tag} className="px-2 py-1 flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormItem>
              
              <FormField
                control={form.control}
                name="team_members"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Team Members</FormLabel>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsAddTeamMemberDialogOpen(true)}
                        className="h-8 flex items-center gap-1 text-xs px-2"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add Member
                      </Button>
                    </div>
                    <div className="space-y-2 border rounded-md p-3 mt-1">
                      {teamMembers.length > 0 ? (
                        teamMembers.map((teamMember) => (
                          <FormField
                            key={teamMember.id}
                            control={form.control}
                            name="team_members"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={teamMember.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(teamMember.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], teamMember.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== teamMember.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal">
                                      {teamMember.name}
                                    </FormLabel>
                                    {teamMember.role && (
                                      <p className="text-sm text-muted-foreground">
                                        {teamMember.role}
                                      </p>
                                    )}
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))
                      ) : (
                        <div className="text-center py-2 text-sm text-muted-foreground">
                          No team members found. Add one to get started.
                        </div>
                      )}
                    </div>
                    <FormMessage />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description of the project..." 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="manager_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Private notes for project management..." 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  These notes are for internal use only.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Add Client Dialog */}
      <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client to assign to projects.
            </DialogDescription>
          </DialogHeader>
          <Form {...clientForm}>
            <form onSubmit={clientForm.handleSubmit(handleAddClient)} className="space-y-4">
              <FormField
                control={clientForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name *</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input placeholder="John Doe" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={clientForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input placeholder="Acme Inc." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={clientForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="client@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={clientForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 555 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={clientForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={clientForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddClientDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Client</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Team Member Dialog */}
      <Dialog open={isAddTeamMemberDialogOpen} onOpenChange={setIsAddTeamMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Create a new team member to assign to projects.
            </DialogDescription>
          </DialogHeader>
          <Form {...teamMemberForm}>
            <form onSubmit={teamMemberForm.handleSubmit(handleAddTeamMember)} className="space-y-4">
              <FormField
                control={teamMemberForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input placeholder="Jane Doe" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={teamMemberForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={teamMemberForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="member@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddTeamMemberDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Team Member</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
