
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChatSession } from "@/services/aiAssistantService";

interface ChatSessionItemProps {
  session: ChatSession;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

const ChatSessionItem: React.FC<ChatSessionItemProps> = ({
  session,
  onLoad,
  onDelete,
  formatDate,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
          onClick={() => onLoad(session.id)}
        >
          <div className="flex justify-between">
            <h4 className="font-semibold truncate">{session.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {session.messages.filter((msg) => msg.role === "user").length > 0 && (
              <Badge variant="secondary">
                {session.messages.filter((msg) => msg.role === "user").length}{" "}
                messages
              </Badge>
            )}
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(session.updated_at)}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-3 line-clamp-2">
            {session.messages.find((msg) => msg.role === "user")?.content ||
              "No user messages"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSessionItem;
