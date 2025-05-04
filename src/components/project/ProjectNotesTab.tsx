import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlusCircle, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { getProjectNotes, createProjectNote, updateProjectNote, deleteProjectNote } from "@/services/projectNotesService";
import { getTeamMembers } from "@/services/teamService";
import { TeamMember } from "@/types/database";
import RichTextEditor from "./RichTextEditor";

interface ProjectNotesTabProps {
  projectId: string;
}

export default function ProjectNotesTab({ projectId }: ProjectNotesTabProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    loadNotes();
    loadTeamMembers();
  }, [projectId]);

  const loadNotes = async () => {
    const data = await getProjectNotes(projectId);
    setNotes(data);
    setLoading(false);
  };

  const loadTeamMembers = async () => {
    const data = await getTeamMembers();
    setTeamMembers(data);
    if (data.length > 0) {
      setSelectedAuthor(data[0].id);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    
    setIsSubmitting(true);
    const result = await createProjectNote({
      project_id: projectId,
      content: noteContent,
      rich_content: noteContent,
      author_id: selectedAuthor
    });
    
    if (result) {
      loadNotes();
      setIsAddModalOpen(false);
      setNoteContent("");
    }
    setIsSubmitting(false);
  };

  const handleEditNote = async () => {
    if (!currentNote || !noteContent.trim()) return;
    
    setIsSubmitting(true);
    const result = await updateProjectNote(currentNote.id, {
      content: noteContent,
      rich_content: noteContent
    });
    
    if (result) {
      loadNotes();
      setIsEditModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;
    
    const success = await deleteProjectNote(id);
    if (success) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const startEditing = (note: any) => {
    setCurrentNote(note);
    setNoteContent(note.rich_content || note.content);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Notes</h3>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {note.author && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={note.author.avatar_url || ''} />
                        <AvatarFallback>
                          {note.author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <CardTitle className="text-base">
                        {note.author ? note.author.name : "Unknown"}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEditing(note)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(note.id)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="prose dark:prose-invert max-w-none" 
                     dangerouslySetInnerHTML={{ __html: note.rich_content || note.content }} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium text-muted-foreground">No notes found</h3>
          <p className="text-sm text-muted-foreground">Add notes for this project</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      )}

      {/* Add Note Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger>
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
            <RichTextEditor
              content={noteContent}
              onChange={setNoteContent}
              placeholder="Write your note here..."
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddNote} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RichTextEditor
              content={noteContent}
              onChange={setNoteContent}
              placeholder="Write your note here..."
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditNote} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
