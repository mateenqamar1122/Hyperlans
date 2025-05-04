
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal, Mail, UserPlus } from "lucide-react";
import { ClientInviteDialog } from "./ClientInviteDialog";
import { getClientAccess, updateClientAccess } from "@/services/clientAccessService";
import { ClientAccess } from "@/types/database";

export function ClientAccessCard({ projectId }: { projectId: string }) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [clientAccess, setClientAccess] = useState<ClientAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientAccess();
  }, [projectId]);

  const loadClientAccess = async () => {
    const data = await getClientAccess(projectId);
    setClientAccess(data);
    setLoading(false);
  };

  const handleAccessLevelChange = async (accessId: string, newLevel: 'view' | 'comment' | 'edit') => {
    const result = await updateClientAccess(accessId, { access_level: newLevel });
    if (result) {
      loadClientAccess();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Client Access</CardTitle>
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
        {loading ? (
          <div className="text-center py-6">Loading client access...</div>
        ) : clientAccess.length > 0 ? (
          <div className="space-y-4">
            {clientAccess.map((access) => (
              <div
                key={access.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <div className="font-medium">{access.clients?.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {access.clients?.email}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{access.access_level}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAccessLevelChange(access.id, "view")}
                      >
                        Set to View Only
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAccessLevelChange(access.id, "comment")}
                      >
                        Allow Comments
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAccessLevelChange(access.id, "edit")}
                      >
                        Allow Editing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No clients have been given access to this project yet.
          </div>
        )}
      </CardContent>

      <ClientInviteDialog
        projectId={projectId}
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onInviteSent={loadClientAccess}
      />
    </Card>
  );
}
