
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Save, Brain, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Message } from "@/services/aiAssistantService";

interface ChatMessageProps {
  message: Message;
  onSaveResponse: (content: string) => void;
  onCopyToClipboard: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSaveResponse,
  onCopyToClipboard,
}) => {
  const renderMessageContent = (content: string) => {
    return (
      <div className="text-sm text-gray-800 dark:text-gray-200 markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={`flex items-start gap-3 mb-6 ${message.role === "user" ? "justify-end" : ""} animate-in fade-in-0 slide-in-from-bottom-3 duration-300`}>
      {message.role !== "user" && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-white shadow-lg ring-2 ring-white dark:ring-gray-800">
          <Brain className="h-4 w-4" />
        </div>
      )}
      
      <div className={`rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 max-w-[85%] ${
        message.role === "user" 
          ? "bg-gradient-to-br from-brand-blue to-brand-blue/90 text-white ml-auto backdrop-blur-sm border border-brand-blue/20" 
          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:border-brand-cyan/30 dark:hover:border-brand-cyan/30"
      }`}>
        {message.role === "user" ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            {renderMessageContent(message.content)}
            
            <div className="flex items-center justify-end gap-1 mt-3 border-t pt-2 border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100 transition-opacity duration-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-gray-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-all duration-200"
                onClick={() => onCopyToClipboard(message.content)}
              >
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-gray-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-all duration-200"
                onClick={() => onSaveResponse(message.content)}
              >
                <Save className="h-3.5 w-3.5 mr-1" /> Save
              </Button>
            </div>
          </>
        )}
      </div>
      
      {message.role === "user" && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-magenta to-brand-magenta/80 flex items-center justify-center text-white shadow-lg ring-2 ring-white dark:ring-gray-800">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
