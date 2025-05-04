
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Lightbulb,
  Plus,
  Edit,
  Trash2,
  Tag,
  ArrowUpDown,
  ThumbsUp,
  Paperclip,
  Calendar
} from "lucide-react";
import { fetchIdeas, createIdea, updateIdea, deleteIdea, voteForIdea, addTagToIdea, uploadAttachment, type Idea } from "@/services/ideaService";
import { useToast } from "@/components/ui/use-toast";

const IdeaBoard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const { toast } = useToast();

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    const fetchedIdeas = await fetchIdeas();
    setIdeas(fetchedIdeas);
  };

  const handleCreateIdea = async (formData: FormData) => {
    const newIdea = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      priority: formData.get('priority') as Idea['priority'],
      stage: 'draft' as Idea['stage'],
      estimated_budget: parseFloat(formData.get('budget') as string) || null,
      estimated_effort: formData.get('effort') as string,
      target_completion_date: formData.get('target_date') as string,
    };

    const created = await createIdea(newIdea);
    if (created) {
      setIsCreateDialogOpen(false);
      loadIdeas();
    }
  };

  const handleVote = async (ideaId: string) => {
    const voted = await voteForIdea(ideaId, 'upvote');
    if (voted) {
      loadIdeas();
    }
  };

  const filteredIdeas = ideas
    .filter(idea => 
      (selectedStage === "all" || idea.stage === selectedStage) &&
      (idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       idea.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return (b.votes_count || 0) - (a.votes_count || 0);
        case "priority":
          return b.priority.localeCompare(a.priority);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Idea Board</h1>
          <p className="text-muted-foreground">
            Capture, organize, and develop your creative ideas.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Idea</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateIdea(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Estimated Budget</Label>
                    <Input id="budget" name="budget" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="effort">Estimated Effort</Label>
                    <Input id="effort" name="effort" placeholder="e.g., 2 weeks" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="target_date">Target Completion Date</Label>
                  <Input id="target_date" name="target_date" type="date" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Idea</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-4">
        <Input 
          placeholder="Search ideas..." 
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={selectedStage} onValueChange={setSelectedStage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="evaluating">Evaluating</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="votes">Most Votes</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="border border-gray-300/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                  {idea.title}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-2">
                  <Badge variant="secondary">{idea.stage}</Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0">
                    {idea.category}
                  </Badge>
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {idea.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => handleVote(idea.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {idea.votes_count || 0}
                  </Button>
                  {idea.attachments && idea.attachments.length > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <Paperclip className="h-3 w-3" />
                      {idea.attachments.length}
                    </Badge>
                  )}
                </div>
                {idea.target_completion_date && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(idea.target_completion_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              {idea.tags && idea.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {idea.tags.map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="outline" 
                      className="bg-purple-100 text-purple-800 border-0"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IdeaBoard;
