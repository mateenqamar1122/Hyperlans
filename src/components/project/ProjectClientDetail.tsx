import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Building, Globe, MapPin, UserPlus, Tag } from "lucide-react";
import { Client, Project } from "@/types/database";
import { ClientInviteDialog } from "./ClientInviteDialog";

interface ProjectClientDetailProps {
  project: Project;
}

export function ProjectClientDetail({ project }: ProjectClientDetailProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const client = project.client;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Client Information</CardTitle>
        <Button
          onClick={() => setIsInviteOpen(true)}
          variant="outline"
          size="sm"
          className="h-8"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Client
        </Button>
      </CardHeader>
      <CardContent>
        {client ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium">Client Name</div>
                <div className="font-semibold">{client.name}</div>
                {client.company && <div className="text-sm text-muted-foreground">{client.company}</div>}
              </div>
            </div>

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

            <div className="flex items-start gap-2">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="font-semibold">{client.status || "N/A"}</div>
              </div>
            </div>

            {client.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Address</div>
                  <div>{client.address}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No client assigned to this project.
          </div>
        )}
      </CardContent>

      <ClientInviteDialog
        projectId={project.id}
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onInviteSent={() => {}}
      />
    </Card>
  );
}