
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle,
  Users,
  UserPlus,
  Search,
  Grid3x3,
  LayoutList,
  Filter,
  ChevronDown,
  ArrowUpWideNarrow,
  ArrowDownNarrowWide,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { TeamMember, getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, getTeamStatistics } from "@/services/teamService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TeamMemberCard from "@/components/TeamMemberCard";

const TeamManager = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState<Omit<TeamMember, "id" | "created_at">>({
    name: "",
    email: "",
    role: "",
    avatar_url: "",
    phone: "",
    department: "",
    location: "",
    bio: "",
    status: "active",
  });

  // Fetch team members
  const {
    data: teamMembers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: getTeamMembers,
  });

  // Fetch team statistics
  const {
    data: teamStats,
    isLoading: isStatsLoading,
  } = useQuery({
    queryKey: ["teamStatistics"],
    queryFn: getTeamStatistics,
  });

  // Create team member mutation
  const createMutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      queryClient.invalidateQueries({ queryKey: ["teamStatistics"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  // Update team member mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TeamMember> }) => 
      updateTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      queryClient.invalidateQueries({ queryKey: ["teamStatistics"] });
    },
  });

  // Delete team member mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      queryClient.invalidateQueries({ queryKey: ["teamStatistics"] });
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
      setSelectedMembers([]);
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      avatar_url: "",
      phone: "",
      department: "",
      location: "",
      bio: "",
      status: "active",
    });
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  // Handle delete
  const handleDelete = () => {
    if (memberToDelete) {
      deleteMutation.mutate(memberToDelete);
    } else if (selectedMembers.length > 0) {
      // Delete selected members one by one
      selectedMembers.forEach(id => {
        deleteMutation.mutate(id);
      });
    }
  };

  // Handle selection toggle
  const toggleSelectMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) 
        ? prev.filter(memberId => memberId !== id) 
        : [...prev, id]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  // Filter and sort team members
  const filteredMembers = teamMembers
    .filter(member => {
      // Apply search filter
      const matchesSearch = searchQuery
        ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      // Apply role filter
      const matchesRole = filterRole
        ? member.role === filterRole
        : true;
      
      // Apply department filter
      const matchesDepartment = filterDepartment
        ? member.department === filterDepartment
        : true;

      return matchesSearch && matchesRole && matchesDepartment;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  // Get unique roles and departments for filters
  const roles = Array.from(new Set(teamMembers.map(m => m.role).filter(Boolean))) as string[];
  const departments = Array.from(new Set(teamMembers.map(m => m.department).filter(Boolean))) as string[];

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Manager</h1>
          <p className="text-muted-foreground">
            Manage your team members, assign roles, and track statistics.
          </p>
        </div>
        <Button 
          className="bg-brand-blue hover:bg-brand-blue/90 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Team Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isStatsLoading ? "..." : teamStats?.totalMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {teamStats?.activeMembers || 0} active members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isStatsLoading ? "..." : teamStats?.departments.length || 0}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {teamStats?.departments.slice(0, 3).map((dept, i) => (
                <Badge key={i} variant="outline">{dept.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isStatsLoading ? "..." : teamStats?.roles.length || 0}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {teamStats?.roles.slice(0, 3).map((role, i) => (
                <Badge key={i} variant="outline">{role.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Team Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isStatsLoading ? "..." : 
                teamStats ? Math.round((teamStats.departments.length / Math.max(teamStats.roles.length, 1)) * 100) + "%" : "0%"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Departments to roles ratio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members, assign roles, and update their information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Filter</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                  <div className="p-2">
                    <Label className="text-xs">Role</Label>
                    <Select value={filterRole || ""} onValueChange={(value) => setFilterRole(value || null)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-2 pt-0">
                    <Label className="text-xs">Department</Label>
                    <Select value={filterDepartment || ""} onValueChange={(value) => setFilterDepartment(value || null)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    {sortOrder === "asc" ? <ArrowUpWideNarrow className="h-4 w-4 mr-1" /> : <ArrowDownNarrowWide className="h-4 w-4 mr-1" />}
                    <span>Sort</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    <ArrowUpWideNarrow className="h-4 w-4 mr-2" /> Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    <ArrowDownNarrowWide className="h-4 w-4 mr-2" /> Name (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedMembers.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedMembers.length})
                </Button>
              )}
            </div>
            
            <div className="flex items-center ml-auto">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Grid View"
                className={viewMode === "grid" ? "bg-muted" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="List View"
                className={viewMode === "list" ? "bg-muted" : ""}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Team Members List/Grid */}
          {isLoading ? (
            <div className="text-center py-12">Loading team members...</div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              Error loading team members. Please try again.
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No team members found. Add some team members to get started.
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="relative">
                  <input 
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleSelectMember(member.id)}
                    className="absolute top-3 left-3 z-10 h-4 w-4 rounded border-gray-300"
                  />
                  <TeamMemberCard 
                    member={member}
                    onEdit={(data) => {
                      updateMutation.mutate({ id: member.id, data });
                    }}
                    onDelete={(id) => {
                      setMemberToDelete(id);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">
                      <input 
                        type="checkbox"
                        checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Department</th>
                    <th className="px-4 py-3 text-left font-medium">Location</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => toggleSelectMember(member.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            {member.phone && (
                              <div className="text-xs text-muted-foreground flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {member.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            {member.email}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">{member.role || "-"}</td>
                      <td className="px-4 py-3">{member.department || "-"}</td>
                      <td className="px-4 py-3">
                        {member.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {member.location}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              // Open edit dialog and populate form data
                              setFormData({ 
                                name: member.name,
                                email: member.email || "",
                                role: member.role || "",
                                avatar_url: member.avatar_url || "",
                                phone: member.phone || "",
                                department: member.department || "",
                                location: member.location || "",
                                bio: member.bio || "",
                                status: member.status || "active"
                              });
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setMemberToDelete(member.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team. Fill out the information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || "active"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save Team Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {selectedMembers.length > 1 || (selectedMembers.length === 1 && !memberToDelete) ? (
                `Are you sure you want to delete ${selectedMembers.length} selected team members? This action cannot be undone.`
              ) : (
                `Are you sure you want to delete this team member? This action cannot be undone.`
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManager;
