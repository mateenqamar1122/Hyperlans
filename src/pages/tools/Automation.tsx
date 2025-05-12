import React, { useState } from "react";
import {
  Play,
  Pause,
  Plus,
  Clock,
  Mail,
  FileText,
  Calendar,
  Trash2,
  Edit,
  MoreHorizontal,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Copy
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data for workflows
const mockWorkflows = [
  {
    id: "wf1",
    name: "Client Onboarding",
    description: "Automatically send welcome emails and setup client accounts",
    status: "active",
    triggers: ["New Client Added"],
    actions: ["Send Welcome Email", "Create Project Folder", "Schedule Kickoff"],
    lastRun: "2023-10-15T14:30:00",
    runCount: 24,
  },
  {
    id: "wf2",
    name: "Invoice Reminder",
    description: "Send reminders for unpaid invoices",
    status: "active",
    triggers: ["Invoice Overdue"],
    actions: ["Send Reminder Email", "Create Follow-up Task"],
    lastRun: "2023-10-18T09:15:00",
    runCount: 47,
  },
  {
    id: "wf3",
    name: "Project Deadline Alert",
    description: "Notify team when project deadlines are approaching",
    status: "inactive",
    triggers: ["Project Deadline (3 days)"],
    actions: ["Send Team Notification", "Create Status Report"],
    lastRun: "2023-10-10T11:20:00",
    runCount: 12,
  },
  {
    id: "wf4",
    name: "Content Approval",
    description: "Route content for approval when drafts are completed",
    status: "active",
    triggers: ["Content Status Changed to 'Ready for Review'"],
    actions: ["Notify Approvers", "Create Approval Task", "Update Content Status"],
    lastRun: "2023-10-17T16:45:00",
    runCount: 31,
  },
  {
    id: "wf5",
    name: "Weekly Report Generator",
    description: "Generate and distribute weekly project status reports",
    status: "active",
    triggers: ["Schedule (Every Friday at 4pm)"],
    actions: ["Generate Report", "Send to Stakeholders", "Archive Report Copy"],
    lastRun: "2023-10-13T16:00:00",
    runCount: 42,
  }
];

// Mock data for workflow templates
const workflowTemplates = [
  {
    id: "template1",
    name: "Client Communication",
    description: "Templates for client communication workflows",
    templates: [
      { id: "t1", name: "Welcome Sequence", popularity: "high" },
      { id: "t2", name: "Feedback Request", popularity: "medium" },
      { id: "t3", name: "Project Update", popularity: "high" },
    ]
  },
  {
    id: "template2",
    name: "Project Management",
    description: "Templates for project management workflows",
    templates: [
      { id: "t4", name: "Deadline Reminder", popularity: "high" },
      { id: "t5", name: "Task Assignment", popularity: "medium" },
      { id: "t6", name: "Project Completion", popularity: "medium" },
    ]
  },
  {
    id: "template3",
    name: "Finance & Billing",
    description: "Templates for finance and billing workflows",
    templates: [
      { id: "t7", name: "Invoice Generation", popularity: "high" },
      { id: "t8", name: "Payment Reminder", popularity: "high" },
      { id: "t9", name: "Expense Approval", popularity: "low" },
    ]
  }
];

// Mock data for workflow history
const workflowHistory = [
  { id: "h1", workflow: "Client Onboarding", status: "success", time: "Today, 2:30 PM", duration: "45s" },
  { id: "h2", workflow: "Invoice Reminder", status: "success", time: "Today, 9:15 AM", duration: "32s" },
  { id: "h3", workflow: "Weekly Report Generator", status: "failed", time: "Oct 13, 4:00 PM", duration: "1m 12s", error: "Email server unavailable" },
  { id: "h4", workflow: "Content Approval", status: "success", time: "Oct 12, 11:30 AM", duration: "28s" },
  { id: "h5", workflow: "Client Onboarding", status: "success", time: "Oct 10, 3:45 PM", duration: "42s" },
];

const Automation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: "",
    actions: [],
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredWorkflows = mockWorkflows.filter(workflow => 
    (searchQuery === "" || 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) &&
    (statusFilter === "all" || workflow.status === statusFilter)
  );

  const handleCreateWorkflow = () => {
    // In a real app, this would call an API to create the workflow
    toast.success("Workflow created successfully!");
    setIsCreateDialogOpen(false);
    setNewWorkflow({ name: "", description: "", trigger: "", actions: [] });
  };

  const handleToggleWorkflowStatus = (id, currentStatus) => {
    // In a real app, this would call an API to update the workflow status
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toast.success(`Workflow ${newStatus === "active" ? "activated" : "deactivated"}`);
  };

  const handleDeleteWorkflow = (id) => {
    // In a real app, this would call an API to delete the workflow
    toast.success("Workflow deleted successfully!");
  };

  const handleRunWorkflow = (id) => {
    // In a real app, this would call an API to run the workflow
    toast.success("Workflow started manually!");
  };

  const handleDuplicateWorkflow = (id) => {
    // In a real app, this would call an API to duplicate the workflow
    toast.success("Workflow duplicated successfully!");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Automation
            </h2>
            <p className="text-muted-foreground">
              Create and manage automated workflows to streamline your processes
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan text-white shadow-lg hover:shadow-brand-blue/25 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Workflow
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1 md:col-span-3 space-y-6"
        >
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center w-full md:w-auto">
                  <Search className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    placeholder="Search workflows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {filteredWorkflows.length > 0 ? (
                  filteredWorkflows.map((workflow) => (
                    <div 
                      key={workflow.id} 
                      className="p-4 hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setIsEditMode(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{workflow.name}</h3>
                            <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                              {workflow.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {workflow.triggers.map((trigger, idx) => (
                              <Badge key={idx} variant="outline" className="bg-primary/5 text-xs">
                                <Zap className="h-3 w-3 mr-1 text-primary" /> {trigger}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRunWorkflow(workflow.id);
                            }}
                            className="h-8 w-8"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Switch 
                            checked={workflow.status === "active"} 
                            onCheckedChange={(checked) => {
                              handleToggleWorkflowStatus(workflow.id, workflow.status);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedWorkflow(workflow);
                                setIsEditMode(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateWorkflow(workflow.id)}>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteWorkflow(workflow.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Last run: {new Date(workflow.lastRun).toLocaleString()}
                        </div>
                        <div>
                          <RefreshCw className="h-3 w-3 mr-1 inline" />
                          {workflow.runCount} runs total
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Zap className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No workflows found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search or filters" 
                        : "Create your first workflow to automate your processes"}
                    </p>
                    {!searchQuery && statusFilter === "all" && (
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Create Workflow
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Workflow Runs</CardTitle>
              <CardDescription>
                History of recent workflow executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowHistory.map((history) => (
                  <div key={history.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      {history.status === "success" ? (
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{history.workflow}</div>
                        <div className="text-xs text-muted-foreground">{history.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        Duration: <span className="font-medium">{history.duration}</span>
                      </div>
                      {history.error && (
                        <Badge variant="destructive" className="text-xs">
                          Error: {history.error}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1 space-y-6"
        >
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Pre-built workflows to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowTemplates.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <h3 className="text-sm font-medium">{category.name}</h3>
                    <div className="space-y-2">
                      {category.templates.map((template) => (
                        <div 
                          key={template.id} 
                          className="p-2 rounded-md border border-border/50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 flex items-center justify-between"
                          onClick={() => {
                            setNewWorkflow({
                              name: template.name,
                              description: "",
                              trigger: "",
                              actions: []
                            });
                            setIsCreateDialogOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            <span>{template.name}</span>
                          </div>
                          {template.popularity === "high" && (
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Automation Stats</CardTitle>
              <CardDescription>
                Your workflow performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Active Workflows</div>
                  <div className="font-medium">{mockWorkflows.filter(w => w.status === "active").length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Total Runs (30 days)</div>
                  <div className="font-medium">156</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Success Rate</div>
                  <div className="font-medium">98.2%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Time Saved (est.)</div>
                  <div className="font-medium">24.5 hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Set up an automated workflow to streamline your processes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                placeholder="e.g., Client Onboarding"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does"
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger</Label>
              <Select
                value={newWorkflow.trigger}
                onValueChange={(value) => setNewWorkflow({ ...newWorkflow, trigger: value })}
              >
                <SelectTrigger id="trigger">
                  <SelectValue placeholder="Select a trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_client">New Client Added</SelectItem>
                  <SelectItem value="project_created">Project Created</SelectItem>
                  <SelectItem value="invoice_sent">Invoice Sent</SelectItem>
                  <SelectItem value="deadline_approaching">Deadline Approaching</SelectItem>
                  <SelectItem value="form_submission">Form Submission</SelectItem>
                  <SelectItem value="scheduled">Scheduled (Time-based)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="space-y-2">
                <div className="p-3 border border-dashed rounded-md flex items-center justify-center">
                  <Button variant="ghost" className="text-muted-foreground">
                    <Plus className="h-4 w-4 mr-2" /> Add Action
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow}>
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Detail/Edit Dialog */}
      {selectedWorkflow && (
        <Dialog open={!!selectedWorkflow} onOpenChange={(open) => !open && setSelectedWorkflow(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>
                  {isEditMode ? "Edit Workflow" : "Workflow Details"}
                </DialogTitle>
                {!isEditMode && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
              <DialogDescription>
                {isEditMode
                  ? "Modify your workflow settings and actions"
                  : selectedWorkflow.description}
              </DialogDescription>
            </DialogHeader>

            {isEditMode ? (
              <div className="space-y-4 py-4">
                {/* Edit Mode Fields */}
                {/* ... Edit form fields would go here ... */}
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <Badge variant={selectedWorkflow.status === "active" ? "default" : "secondary"}>
                    {selectedWorkflow.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Last run: {new Date(selectedWorkflow.lastRun).toLocaleString()}
                  </div>
                </div>

                {/* Triggers, Actions, Statistics */}
                {/* ... Additional details would go here ... */}
              </div>
            )}

            <DialogFooter>
              {isEditMode ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Workflow updated successfully!");
                      setIsEditMode(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                    Close
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleRunWorkflow(selectedWorkflow.id)}
                  >
                    <Play className="h-4 w-4 mr-2" /> Run Now
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Automation;