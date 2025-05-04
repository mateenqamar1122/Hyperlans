
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, RotateCcw } from "lucide-react";

interface ChatInputAreaProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleClearChat: () => void;
  isLoading: boolean;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleClearChat,
  isLoading,
  handleKeyPress,
}) => {
  return (
    <div className="p-4 border-t dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-filter backdrop-blur-sm rounded-b-xl">
      <div className="flex gap-2 relative">
        <Textarea
          placeholder="Type your message here..."
          className="resize-none min-h-[60px] bg-white dark:bg-gray-800 border-gray-300/70 dark:border-gray-700/70 rounded-xl focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue/50 transition-all duration-200 shadow-inner"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <div className="flex flex-col gap-2">
          <Button
            className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={handleClearChat}
            disabled={isLoading}
            title="Clear chat"
            className="border-gray-300/70 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInputArea;
