
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MoreVertical, Copy, Brain, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SavedResponse } from "@/services/aiAssistantService";

interface SavedResponseItemProps {
  item: SavedResponse;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
  onAskAbout: (title: string) => void;
  formatDate: (date: string) => string;
}

const SavedResponseItem: React.FC<SavedResponseItemProps> = ({
  item,
  onCopy,
  onDelete,
  onAskAbout,
  formatDate,
}) => {
  return (
    <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{item.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onCopy(item.content)}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAskAbout(item.title)}>
                <Brain className="h-4 w-4 mr-2" /> Ask About
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item.id)}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground max-h-24 overflow-hidden relative">
          <div className="line-clamp-3">{item.content}</div>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Saved on {formatDate(item.created_at)}
        </p>
      </CardContent>
    </Card>
  );
};

export default SavedResponseItem;
