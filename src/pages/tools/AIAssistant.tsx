
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, History, Star, Plus, Sparkles } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import ChatContainer from "@/components/aiassistant/ChatContainer";
import PromptLibrary from "@/components/aiassistant/PromptLibrary";
import ProTips from "@/components/aiassistant/ProTips";
import ChatHistory from "@/components/aiassistant/ChatHistory";
import SavedResponses from "@/components/aiassistant/SavedResponses";
import SaveResponseDialog from "@/components/aiassistant/SaveResponseDialog";
import SaveChatDialog from "@/components/aiassistant/SaveChatDialog";

const AIAssistant = () => {
  const {
    // State
    inputMessage,
    setInputMessage,
    messages,
    isLoading,
    savedResponses,
    chatSessions,
    saveDialogOpen,
    setSaveDialogOpen,
    saveChatDialogOpen,
    setSaveChatDialogOpen,
    saveTitle,
    setSaveTitle,
    saveChatTitle,
    setSaveChatTitle,
    currentChatId,
    currentTab,
    setCurrentTab,
    selectedCategory,
    setSelectedCategory,

    // Handlers
    handleSendMessage,
    handleKeyPress,
    handleNewChat,
    handleClearChat,
    handlePromptClick,
    handleSaveResponse,
    submitSaveResponse,
    handleSaveChat,
    submitSaveChat,
    handleLoadChatSession,
    handleDeleteChatSession,
    handleCopyToClipboard,
    handleDeleteSavedResponse,
    handleAskAbout,
    formatDate,
  } = useAIAssistant();

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative">
              <Brain className="h-9 w-9 text-brand-blue drop-shadow-md" />
              <Sparkles className="h-4 w-4 text-brand-cyan absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">AI Assistant</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Your personal AI assistant to help with tasks, answer questions, and
            provide guidance for your freelance or small business needs.
          </p>
        </div>
        <Button
          onClick={handleNewChat}
          className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:shadow-xl hover:shadow-brand-blue/30 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" /> New Chat
        </Button>
      </motion.div>

      <div className="border-b pb-2 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-t-lg shadow-sm">
        <Tabs defaultValue="chat" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-1 w-full md:w-auto flex justify-start bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-md border-b-0 p-1">
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/10 data-[state=active]:to-brand-cyan/10 data-[state=active]:text-brand-blue dark:data-[state=active]:text-brand-cyan transition-all duration-300">
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/10 data-[state=active]:to-brand-cyan/10 data-[state=active]:text-brand-blue dark:data-[state=active]:text-brand-cyan transition-all duration-300">
              <History className="h-4 w-4" /> Chat History
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/10 data-[state=active]:to-brand-cyan/10 data-[state=active]:text-brand-blue dark:data-[state=active]:text-brand-cyan transition-all duration-300">
              <Star className="h-4 w-4" /> Saved Responses
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-0 p-0">
        <AnimatePresence mode="wait">
          <motion.div 
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4"
          >
            <motion.div 
              className="lg:col-span-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ChatContainer
                currentChatId={currentChatId}
                chatSessions={chatSessions}
                messages={messages}
                isLoading={isLoading}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                handleSaveChat={handleSaveChat}
                handleClearChat={handleClearChat}
                handleKeyPress={handleKeyPress}
                handleSaveResponse={handleSaveResponse}
                handleCopyToClipboard={handleCopyToClipboard}
              />
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <PromptLibrary
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                handlePromptClick={handlePromptClick}
              />
              <ProTips />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </TabsContent>

      <TabsContent value="history" className="mt-0 p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <ChatHistory
              chatSessions={chatSessions}
              onLoadChatSession={handleLoadChatSession}
              onDeleteChatSession={handleDeleteChatSession}
              formatDate={formatDate}
            />
          </motion.div>
        </AnimatePresence>
      </TabsContent>

      <TabsContent value="saved" className="mt-0 p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <SavedResponses
              savedResponses={savedResponses}
              onCopyToClipboard={handleCopyToClipboard}
              onDeleteSavedResponse={handleDeleteSavedResponse}
              onAskAbout={handleAskAbout}
              formatDate={formatDate}
            />
          </motion.div>
        </AnimatePresence>
      </TabsContent>
        </Tabs>
      </div>

      

      {/* Dialogs */}
      <SaveResponseDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        title={saveTitle}
        setTitle={setSaveTitle}
        onSave={submitSaveResponse}
      />

      <SaveChatDialog
        open={saveChatDialogOpen}
        onOpenChange={setSaveChatDialogOpen}
        title={saveChatTitle}
        setTitle={setSaveChatTitle}
        onSave={submitSaveChat}
      />
    </div>
  );
};

export default AIAssistant;
