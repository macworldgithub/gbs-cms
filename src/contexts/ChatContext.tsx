import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chat, ChatTheme, ChatContextType } from '../types';
import { chatService } from '../services/chatService';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [groupChats, setGroupChats] = useState<Chat[]>([]);
  const [directChats, setDirectChats] = useState<Chat[]>([]);
  const [chatThemes, setChatThemes] = useState<ChatTheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allChats, groups, directs, themes] = await Promise.all([
        chatService.getAllChats(),
        chatService.getGroupChats(),
        chatService.getDirectChats(),
        chatService.getChatThemes(),
      ]);

      setChats(allChats);
      setGroupChats(groups);
      setDirectChats(directs);
      setChatThemes(themes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (chatData: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newChat = await chatService.createChat(chatData);
      
      setChats(prev => [...prev, newChat]);
      if (newChat.type === 'group') {
        setGroupChats(prev => [...prev, newChat]);
      } else {
        setDirectChats(prev => [...prev, newChat]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (chatId: string, messageData: any) => {
    try {
      setError(null);
      await chatService.sendMessage(chatId, messageData);
      
      // Refresh chats to get updated messages
      await fetchChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  };

  const updateChatTheme = async (chatId: string, themeId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedChat = await chatService.updateChatTheme(chatId, themeId);
      
      setChats(prev => prev.map(chat => chat.id === chatId ? updatedChat : chat));
      setGroupChats(prev => prev.map(chat => chat.id === chatId ? updatedChat : chat));
      setDirectChats(prev => prev.map(chat => chat.id === chatId ? updatedChat : chat));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update chat theme');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await chatService.deleteChat(id);
      
      setChats(prev => prev.filter(chat => chat.id !== id));
      setGroupChats(prev => prev.filter(chat => chat.id !== id));
      setDirectChats(prev => prev.filter(chat => chat.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const value: ChatContextType = {
    chats,
    groupChats,
    directChats,
    chatThemes,
    loading,
    error,
    createChat,
    sendMessage,
    updateChatTheme,
    deleteChat,
    fetchChats,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};