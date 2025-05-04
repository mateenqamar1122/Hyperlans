import { useState } from "react";
import { Client } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, Building, FileText, Edit, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteClient } from "@/services/clientService";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import InsightsCard from "@/components/InsightsCard";
import { Progress } from "@/components/ui/progress";

interface ClientDetailProps {
  client: Client;
  onEdit: () => void;
  onBack: () => void;
  onDeleted: () => void;
}

export default function ClientDetail({ client, onEdit, onBack, onDeleted }: ClientDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteClient(client.id);
      if (success) {
        onDeleted();
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <h2 className="text-3xl font-bold">{client.name}</h2>
        {client.status && (
          <Badge variant={client.status === "active" ? "cyan" : "secondary"}>
            {client.status}
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {client.name}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <InsightsCard entityType="client" entityId={client.id} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Complete details about this client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {client.company && (
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Company</div>
                    <div>{client.company}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div>
                    <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                      {client.email}
                    </a>
                  </div>
                </div>
              </div>
              
              {client.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div>
                      <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                        {client.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {(client.address || client.city || client.state || client.postal_code || client.country) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div>
                      {client.address && <div>{client.address}</div>}
                      <div>
                        {[
                          client.city,
                          client.state,
                          client.postal_code
                        ].filter(Boolean).join(", ")}
                      </div>
                      {client.country && <div>{client.country}</div>}
                    </div>
                  </div>
                </div>
              )}
              
              {client.website && (
                <div className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Website</div>
                    <div>
                      <a 
                        href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {client.website}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {client.industry && (
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Industry</div>
                    <div>{client.industry}</div>
                  </div>
                </div>
              )}
              
              {client.notes && (
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="whitespace-pre-wrap">{client.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Person</CardTitle>
            </CardHeader>
            <CardContent>
              {client.contact_name ? (
                <div className="space-y-3">
                  <div className="font-semibold">{client.contact_name}</div>
                  {client.contact_position && (
                    <div className="text-muted-foreground">{client.contact_position}</div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">No contact person specified</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Client Since</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold">
                {format(new Date(client.created_at), "MMM d, yyyy")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Projects associated with this client</CardDescription>
        </CardHeader>
        <CardContent>
          {client.projects && client.projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.projects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        project.status === "completed" ? "blue" :
                        project.status === "in-progress" ? "cyan" :
                        project.status === "on-hold" ? "magenta" :
                        "secondary"
                      }>
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.deadline ? format(new Date(project.deadline), "MMM d, yyyy") : "Not set"}
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <Progress 
                          value={project.progress} 
                          size="sm" 
                          className="h-2" 
                          variant={
                            project.progress < 25 ? "danger" :
                            project.progress < 50 ? "warning" :
                            project.progress < 75 ? "info" : "success"
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-muted-foreground p-2">No projects for this client yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
