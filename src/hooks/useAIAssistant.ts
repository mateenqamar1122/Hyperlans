
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Message,
  ChatSession,
  SavedResponse,
  sendMessage,
  saveResponse,
  getSavedResponses,
  deleteSavedResponse,
  saveChatSession,
  getChatSessions,
  deleteChatSession,
  getChatSessionById,
  updateChatSession,
} from "@/services/aiAssistantService";

export const useAIAssistant = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveChatDialogOpen, setSaveChatDialogOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveChatTitle, setSaveChatTitle] = useState("");
  const [messageToSave, setMessageToSave] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("chat");
  const [newChatClicked, setNewChatClicked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message when component mounts
    if (!currentChatId) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm your AI assistant specialized in helping freelancers and small business owners. I can help with drafting emails, creating marketing content, brainstorming ideas, and much more. How can I assist you today?",
        },
      ]);
    }

    // Load saved responses and chat sessions
    loadSavedResponses();
    loadChatSessions();
  }, []);

  const loadSavedResponses = async () => {
    const responses = await getSavedResponses();
    setSavedResponses(responses);
  };

  const loadChatSessions = async () => {
    const sessions = await getChatSessions();
    setChatSessions(sessions);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendMessage(inputMessage, messages);
      
      if (response) {
        setMessages((prev) => [...prev, response]);
      } else {
        toast.error("Failed to get a response. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while communicating with the AI assistant.");
    } finally {
      setIsLoading(false);
      
      // Auto-save the chat if it's already been saved once
      if (currentChatId) {
        const updatedMessages = [...messages, userMessage];
        await updateChatSession(currentChatId, updatedMessages);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI assistant specialized in helping freelancers and small business owners. I can help with drafting emails, creating marketing content, brainstorming ideas, and much more. How can I assist you today?",
      },
    ]);
    setNewChatClicked(true);
    setCurrentTab("chat");
    setSelectedCategory(null);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. How can I help you today?",
      },
    ]);
    setCurrentChatId(null);
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleSaveResponse = (content: string) => {
    setMessageToSave(content);
    setSaveTitle("");
    setSaveDialogOpen(true);
  };

  const submitSaveResponse = async () => {
    if (!messageToSave || !saveTitle.trim()) return;

    const saved = await saveResponse(saveTitle, messageToSave);
    if (saved) {
      loadSavedResponses();
      setSaveDialogOpen(false);
      setMessageToSave(null);
    }
  };

  const handleSaveChat = () => {
    if (messages.length <= 1) {
      toast.error("Cannot save an empty chat session");
      return;
    }

    // Generate default title from first user message
    const firstUserMessage = messages.find((msg) => msg.role === "user");
    const defaultTitle = firstUserMessage
      ? firstUserMessage.content.substring(0, 30) +
        (firstUserMessage.content.length > 30 ? "..." : "")
      : "New chat session";

    setSaveChatTitle(defaultTitle);
    setSaveChatDialogOpen(true);
  };

  const submitSaveChat = async () => {
    if (!saveChatTitle.trim() || messages.length <= 1) return;

    const savedId = await saveChatSession(saveChatTitle, messages);
    if (savedId) {
      setCurrentChatId(savedId);
      loadChatSessions();
      setSaveChatDialogOpen(false);
      toast.success("Chat saved successfully!");
    }
  };

  const handleLoadChatSession = async (chatId: string) => {
    const session = await getChatSessionById(chatId);
    if (session) {
      setMessages(session.messages);
      setCurrentChatId(chatId);
      setCurrentTab("chat");
    }
  };

  const handleDeleteChatSession = async (chatId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat session?"
    );
    if (confirmed) {
      const deleted = await deleteChatSession(chatId);
      if (deleted) {
        loadChatSessions();
        if (currentChatId === chatId) {
          handleNewChat();
        }
      }
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch((err) => toast.error("Failed to copy text"));
  };

  const handleDeleteSavedResponse = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this saved response?"
    );
    if (confirmed) {
      const deleted = await deleteSavedResponse(id);
      if (deleted) {
        loadSavedResponses();
      }
    }
  };

  const handleAskAbout = (title: string) => {
    setInputMessage(`Please expand on this topic: ${title}`);
    setCurrentTab("chat");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return {
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
    messageToSave,
    currentChatId,
    currentTab,
    setCurrentTab,
    newChatClicked,
    selectedCategory,
    setSelectedCategory,
    messagesEndRef,

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
  };
};
