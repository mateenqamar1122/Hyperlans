
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Wand2, 
  Copy, 
  Download, 
  Bookmark, 
  Star, 
  Clock, 
  Search, 
  Trash2, 
  Save, 
  Loader2,
  ListFilter,
  Tag,
  Pencil,
  BookmarkCheck,
  RotateCcw,
  File,
  FileText
} from "lucide-react";
import { 
  generateContent, 
  saveContentGeneration, 
  getContentGenerations,
  updateContentGeneration,
  deleteContentGeneration,
  toggleFavorite,
  ContentGeneration 
} from "@/services/contentGenerationService";
import { toast } from "sonner";

const ContentGenerator = () => {
  // States for the form
  const [activeTab, setActiveTab] = useState("text");
  const [contentType, setContentType] = useState("paragraph");
  const [tone, setTone] = useState("professional");
  const [keywords, setKeywords] = useState("");
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Query for fetching saved content generations
  const { data: savedGenerations = [], isLoading } = useQuery({
    queryKey: ['contentGenerations'],
    queryFn: getContentGenerations,
  });

  // Mutations for content operations
  const generateMutation = useMutation({
    mutationFn: generateContent,
    onSuccess: (data) => {
      if (data) {
        setGeneratedContent(data);
        // Generate a title from keywords if not provided
        if (!title) {
          let generatedTitle = keywords.split(' ').slice(0, 5).join(' ');
          if (generatedTitle.length > 30) {
            generatedTitle = generatedTitle.substring(0, 30) + '...';
          }
          setTitle(generatedTitle);
        }
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveContentGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
      toast.success("Content saved successfully");
      // Reset form after saving
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ContentGeneration> }) =>
      updateContentGeneration(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContentGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      toggleFavorite(id, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
    },
  });

  // Function to handle content generation
  const handleGenerateContent = async () => {
    if (!keywords) {
      toast.error("Please enter keywords or a topic");
      return;
    }

    setIsGenerating(true);
    try {
      await generateMutation.mutateAsync({
        prompt: keywords,
        contentType,
        tone,
        instructions
      });
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save generated content
  const handleSaveContent = () => {
    if (!generatedContent || !title) {
      toast.error("Content and title are required");
      return;
    }

    saveMutation.mutate({
      title,
      prompt: keywords,
      content: generatedContent,
      content_type: contentType,
      tone,
      tags: selectedTags.length > 0 ? selectedTags : null,
    });
  };

  // Function to update content
  const handleUpdateContent = (id: string) => {
    if (editingId === id) {
      updateMutation.mutate({
        id,
        updates: {
          title,
          content: generatedContent,
          tags: selectedTags.length > 0 ? selectedTags : null,
        },
      });
      setEditingId(null);
    } else {
      const item = savedGenerations.find(gen => gen.id === id);
      if (item) {
        setTitle(item.title);
        setGeneratedContent(item.content);
        setKeywords(item.prompt);
        setContentType(item.content_type);
        setTone(item.tone || "professional");
        setSelectedTags(item.tags || []);
        setEditingId(id);
        setShowHistory(false);
      }
    }
  };

  // Function to add a tag
  const addTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag("");
    }
  };

  // Function to remove a tag
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Function to copy content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Content copied to clipboard");
  };

  // Function to download content
  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title || "generated-content"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Content downloaded");
  };

  // Function to reset the form
  const resetForm = () => {
    setTitle("");
    setKeywords("");
    setInstructions("");
    setGeneratedContent("");
    setSelectedTags([]);
    setEditingId(null);
  };

  // Filter saved generations based on search term and selected tags
  const filteredGenerations = savedGenerations.filter((gen) => {
    const matchesSearch = !searchTerm || 
      gen.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gen.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gen.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      (gen.tags && selectedTags.every(tag => gen.tags?.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  // Get all unique tags from saved generations
  const allTags = Array.from(
    new Set(
      savedGenerations
        .flatMap(gen => gen.tags || [])
        .filter(Boolean)
    )
  );

  // Set contentType and tone based on activeTab
  useEffect(() => {
    switch (activeTab) {
      case "text":
        setContentType("paragraph");
        break;
      case "social":
        setContentType("social-post");
        break;
      case "email":
        setContentType("email");
        break;
      case "blog":
        setContentType("blog-outline");
        break;
      default:
        setContentType("paragraph");
    }
  }, [activeTab]);

  // Handle tags input with Enter key
  const handleTagsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Generator</h1>
        <p className="text-muted-foreground">
          Generate professional content for various purposes with AI assistance.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="text">Text Content</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="blog">Blog Ideas</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          onClick={() => setShowHistory(!showHistory)}
          className="ml-4"
        >
          {showHistory ? "Hide History" : "Show History"}
        </Button>
      </div>

      {!showHistory ? (
        <div className="space-y-4">
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>
                {activeTab === "text" && "Generate Text Content"}
                {activeTab === "social" && "Generate Social Media Content"}
                {activeTab === "email" && "Generate Email Templates"}
                {activeTab === "blog" && "Generate Blog Ideas"}
              </CardTitle>
              <CardDescription>
                {activeTab === "text" && "Create professional text with AI assistance"}
                {activeTab === "social" && "Create engaging posts for various platforms"}
                {activeTab === "email" && "Create professional email templates"}
                {activeTab === "blog" && "Generate engaging blog topics and outlines"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTab === "text" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paragraph">Paragraph</SelectItem>
                          <SelectItem value="bullet-points">Bullet Points</SelectItem>
                          <SelectItem value="headline">Headlines</SelectItem>
                          <SelectItem value="slogan">Slogan/Tagline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {activeTab === "social" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter-post">Twitter/X</SelectItem>
                          <SelectItem value="linkedin-post">LinkedIn</SelectItem>
                          <SelectItem value="instagram-caption">Instagram Caption</SelectItem>
                          <SelectItem value="facebook-post">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          <SelectItem value="promotional">Promotional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {activeTab === "email" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select email type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow-up-email">Follow-up Email</SelectItem>
                          <SelectItem value="welcome-email">Welcome Email</SelectItem>
                          <SelectItem value="sales-outreach">Sales Outreach</SelectItem>
                          <SelectItem value="cold-email">Cold Email</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {activeTab === "blog" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog-outline">Blog Outline</SelectItem>
                          <SelectItem value="blog-intro">Blog Introduction</SelectItem>
                          <SelectItem value="blog-title-ideas">Blog Title Ideas</SelectItem>
                          <SelectItem value="blog-conclusion">Blog Conclusion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="informative">Informative</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Topic or Keywords</Label>
                  <Input 
                    placeholder="Enter topic or keywords (e.g., digital marketing, productivity tips)" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Instructions (Optional)</Label>
                  <Textarea 
                    placeholder="Add any specific requirements or context..." 
                    className="resize-none" 
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white"
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !keywords}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
                
                {generatedContent && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input 
                        placeholder="Enter a title for this content" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tags (Optional)</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button 
                              onClick={() => removeTag(tag)}
                              className="hover:text-destructive ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleTagsKeyDown}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={addTag}
                          disabled={!newTag}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Generated Content</h3>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={downloadContent}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {!editingId ? (
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveContent}>
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleUpdateContent(editingId)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
                        {generatedContent}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      {editingId ? (
                        <>
                          <Button variant="outline" onClick={resetForm}>
                            Cancel
                          </Button>
                          <Button onClick={() => handleUpdateContent(editingId)}>
                            Update Content
                          </Button>
                        </>
                      ) : (
                        <Button onClick={handleSaveContent} disabled={!title || !generatedContent}>
                          Save Content
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Saved Content</CardTitle>
              <CardDescription>
                Browse, edit, and manage your saved content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search saved content..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex gap-2 whitespace-nowrap">
                        <ListFilter className="h-4 w-4" />
                        Filter by Tags
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filter by Tags</DialogTitle>
                        <DialogDescription>
                          Select tags to filter your saved content
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {allTags.length > 0 ? (
                            allTags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant={selectedTags.includes(tag) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (selectedTags.includes(tag)) {
                                    setSelectedTags(selectedTags.filter(t => t !== tag));
                                  } else {
                                    setSelectedTags([...selectedTags, tag]);
                                  }
                                }}
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No tags found</p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedTags([])}
                        >
                          Clear All
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredGenerations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGenerations.map((gen) => (
                      <Card key={gen.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{gen.title}</CardTitle>
                              <CardDescription className="flex flex-wrap gap-2 items-center mt-1">
                                <Badge variant="outline">{gen.content_type}</Badge>
                                {gen.tone && <Badge variant="outline">{gen.tone}</Badge>}
                                <span className="text-xs flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(gen.created_at || "").toLocaleDateString()}
                                </span>
                              </CardDescription>
                              {gen.tags && gen.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {gen.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => favoriteMutation.mutate({ 
                                  id: gen.id, 
                                  isFavorite: !(gen.is_favorite || false) 
                                })}
                              >
                                {gen.is_favorite ? (
                                  <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => handleUpdateContent(gen.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete "{gen.title}"? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => deleteMutation.mutate(gen.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm whitespace-pre-wrap line-clamp-3">
                            {gen.content}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <span className="text-xs text-muted-foreground">
                            Keywords: {gen.prompt}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => {
                              navigator.clipboard.writeText(gen.content);
                              toast.success("Content copied to clipboard");
                            }}>
                              <Copy className="h-4 w-4 mr-1" /> Copy
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <FileText className="h-4 w-4 mr-1" /> View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>{gen.title}</DialogTitle>
                                  <DialogDescription className="flex flex-wrap gap-2 items-center mt-1">
                                    <Badge variant="outline">{gen.content_type}</Badge>
                                    {gen.tone && <Badge variant="outline">{gen.tone}</Badge>}
                                    <span className="text-xs flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(gen.created_at || "").toLocaleDateString()}
                                    </span>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="border rounded-md p-4 my-4 whitespace-pre-wrap overflow-auto max-h-[50vh]">
                                  {gen.content}
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    className="mr-auto"
                                    onClick={() => {
                                      const element = document.createElement("a");
                                      const file = new Blob([gen.content], { type: "text/plain" });
                                      element.href = URL.createObjectURL(file);
                                      element.download = `${gen.title || "content"}.txt`;
                                      document.body.appendChild(element);
                                      element.click();
                                      document.body.removeChild(element);
                                      toast.success("Content downloaded");
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-1" /> Download
                                  </Button>
                                  <Button onClick={() => handleUpdateContent(gen.id)}>
                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                    <h3 className="text-lg font-medium">No content found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedTags.length > 0 
                        ? "Try adjusting your search or filters" 
                        : "Generate and save some content to see it here"}
                    </p>
                    {(searchTerm || selectedTags.length > 0) && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedTags([]);
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" /> Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;