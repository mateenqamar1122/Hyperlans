
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History, Archive } from "lucide-react";
import ChatSessionItem from "./ChatSessionItem";
import { ChatSession } from "@/services/aiAssistantService";

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  onLoadChatSession: (id: string) => void;
  onDeleteChatSession: (id: string) => void;
  formatDate: (date: string) => string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatSessions,
  onLoadChatSession,
  onDeleteChatSession,
  formatDate,
}) => {
  return (
    <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-800">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-brand-blue" />
          Chat History
        </CardTitle>
        <CardDescription>
          Your saved conversations with the AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {chatSessions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No saved chats yet.</p>
            <p className="text-sm mt-1">
              Save your conversations to continue them later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {chatSessions.map((session) => (
              <ChatSessionItem
                key={session.id}
                session={session}
                onLoad={onLoadChatSession}
                onDelete={onDeleteChatSession}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatHistory;
