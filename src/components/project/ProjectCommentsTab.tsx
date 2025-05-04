
import { useState, useEffect, FormEvent } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Loader2 
} from "lucide-react";
import { 
  getProjectComments,
  createProjectComment,
  updateProjectComment,
  deleteProjectComment
} from "@/services/projectCommentsService";
import { getTeamMembers } from "@/services/teamService";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMember } from "@/types/database";

interface ProjectCommentsTabProps {
  projectId: string;
}

export default function ProjectCommentsTab({ projectId }: ProjectCommentsTabProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  
  useEffect(() => {
    loadComments();
    loadTeamMembers();
  }, [projectId]);

  const loadComments = async () => {
    setLoading(true);
    const data = await getProjectComments(projectId);
    setComments(data);
    setLoading(false);
  };

  const loadTeamMembers = async () => {
    const data = await getTeamMembers();
    setTeamMembers(data);
    if (data.length > 0) {
      setSelectedAuthor(data[0].id);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    setIsSubmitting(true);
    const result = await createProjectComment({
      project_id: projectId,
      content: commentContent,
      author_id: selectedAuthor || null,
    });
    
    if (result) {
      // Fetch the updated comments with author info
      const updatedComments = await getProjectComments(projectId);
      setComments(updatedComments);
      setCommentContent("");
    }
    setIsSubmitting(false);
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const saveEditedComment = async (commentId: string) => {
    if (!editingContent.trim()) return;
    
    setIsSubmitting(true);
    const result = await updateProjectComment(commentId, {
      content: editingContent
    });
    
    if (result) {
      // Fetch the updated comments with author info
      const updatedComments = await getProjectComments(projectId);
      setComments(updatedComments);
      setEditingCommentId(null);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    
    const success = await deleteProjectComment(id);
    if (success) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments</h3>

      <div className="bg-muted rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-3">
            <Select 
              value={selectedAuthor} 
              onValueChange={setSelectedAuthor}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Textarea 
              placeholder="Add a comment..." 
              value={commentContent} 
              onChange={(e) => setCommentContent(e.target.value)} 
              className="min-h-[80px]"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="sm" 
              disabled={isSubmitting || !commentContent.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Post Comment
            </Button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="overflow-hidden">
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {comment.author && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar_url || ''} />
                        <AvatarFallback>
                          {comment.author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <CardTitle className="text-base">
                        {comment.author ? comment.author.name : "Unknown"}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(comment.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEditing(comment)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(comment.id)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4">
                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea 
                      value={editingContent} 
                      onChange={(e) => setEditingContent(e.target.value)} 
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => saveEditedComment(comment.id)}
                        disabled={isSubmitting || !editingContent.trim()}
                      >
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{comment.content}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium text-muted-foreground">No comments yet</h3>
          <p className="text-sm text-muted-foreground">Be the first to comment</p>
        </div>
      )}
    </div>
  );
}
