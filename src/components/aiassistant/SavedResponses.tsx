
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star, Bookmark } from "lucide-react";
import SavedResponseItem from "./SavedResponseItem";
import { SavedResponse } from "@/services/aiAssistantService";

interface SavedResponsesProps {
  savedResponses: SavedResponse[];
  onCopyToClipboard: (text: string) => void;
  onDeleteSavedResponse: (id: string) => void;
  onAskAbout: (title: string) => void;
  formatDate: (date: string) => string;
}

const SavedResponses: React.FC<SavedResponsesProps> = ({
  savedResponses,
  onCopyToClipboard,
  onDeleteSavedResponse,
  onAskAbout,
  formatDate,
}) => {
  return (
    <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-800">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-brand-blue" />
          Saved Responses
        </CardTitle>
        <CardDescription>
          Your bookmarked AI responses for quick reference
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {savedResponses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No saved responses yet.</p>
            <p className="text-sm mt-1">
              Click the save icon on any AI response to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedResponses.map((item) => (
              <SavedResponseItem
                key={item.id}
                item={item}
                onCopy={onCopyToClipboard}
                onDelete={onDeleteSavedResponse}
                onAskAbout={onAskAbout}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedResponses;
