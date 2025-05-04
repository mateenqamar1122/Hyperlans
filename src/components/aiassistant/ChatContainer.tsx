
import React, { useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatInputArea from "./ChatInputArea";
import { Message } from "@/services/aiAssistantService";

interface ChatContainerProps {
  currentChatId: string | null;
  chatSessions: any[];
  messages: Message[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleSaveChat: () => void;
  handleClearChat: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSaveResponse: (content: string) => void;
  handleCopyToClipboard: (text: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  currentChatId,
  chatSessions,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleSaveChat,
  handleClearChat,
  handleKeyPress,
  handleSaveResponse,
  handleCopyToClipboard,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-xl h-full backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ease-in-out">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 border-b dark:border-gray-800 backdrop-filter backdrop-blur-sm">
        <div>
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">
            <Brain className="h-5 w-5 text-brand-blue" />
            {currentChatId
              ? chatSessions.find((session) => session.id === currentChatId)?.title || "Current Chat"
              : "New Chat"}
          </CardTitle>
          <CardDescription>
            Ask anything and get instant, helpful responses
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveChat}
            disabled={messages.length <= 1}
            className="border-brand-blue/30 hover:bg-brand-blue/10 hover:text-brand-blue transition-all duration-200 hover:scale-105"
          >
            <Save className="h-4 w-4 mr-1" /> Save Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[580px]">
        <ScrollArea className="flex-1 p-4 h-[520px] bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              onSaveResponse={handleSaveResponse}
              onCopyToClipboard={handleCopyToClipboard}
            />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-white">
                <Brain className="h-4 w-4" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <ChatInputArea
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleClearChat={handleClearChat}
          isLoading={isLoading}
          handleKeyPress={handleKeyPress}
        />
      </CardContent>
    </Card>
  );
};

export default ChatContainer;
