import { Chat, Message, ChatTheme } from '../types';

class ChatService {
  private chats: Chat[] = [
    {
      id: '1',
      type: 'direct',
      participants: [{ id: '1' } as any, { id: '2' } as any],
      messages: [
        {
          id: '1',
          chatId: '1',
          senderId: '2',
          content: 'Hey! How are you doing?',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000),
          isRead: true,
        },
        {
          id: '2',
          chatId: '1',
          senderId: '1',
          content: 'I\'m good! Thanks for asking.',
          type: 'text',
          timestamp: new Date(Date.now() - 3000000),
          isRead: true,
        },
      ],
      isActive: true,
      theme: {
        id: '1',
        name: 'Default',
        primaryColor: '#ec2227',
        secondaryColor: '#f5f5f5',
        textColor: '#333333',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
    {
      id: '2',
      type: 'group',
      name: 'Tech Enthusiasts',
      participants: [{ id: '1' } as any, { id: '2' } as any, { id: '3' } as any],
      messages: [
        {
          id: '3',
          chatId: '2',
          senderId: '1',
          content: 'Anyone going to the tech conference?',
          type: 'text',
          timestamp: new Date(Date.now() - 7200000),
          isRead: false,
        },
      ],
      isActive: true,
      theme: {
        id: '2',
        name: 'Dark',
        primaryColor: '#1a1a1a',
        secondaryColor: '#333333',
        textColor: '#ffffff',
      },
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date(),
    },
  ];

  private chatThemes: ChatTheme[] = [
    {
      id: '1',
      name: 'Default',
      primaryColor: '#ec2227',
      secondaryColor: '#f5f5f5',
      textColor: '#333333',
    },
    {
      id: '2',
      name: 'Dark',
      primaryColor: '#1a1a1a',
      secondaryColor: '#333333',
      textColor: '#ffffff',
    },
    {
      id: '3',
      name: 'Ocean',
      primaryColor: '#0077be',
      secondaryColor: '#e6f3ff',
      textColor: '#003d66',
    },
    {
      id: '4',
      name: 'Forest',
      primaryColor: '#228b22',
      secondaryColor: '#f0fff0',
      textColor: '#006400',
    },
  ];

  async getAllChats(): Promise<Chat[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.chats.filter(chat => chat.isActive);
  }

  async getDirectChats(): Promise<Chat[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.chats.filter(chat => chat.type === 'direct' && chat.isActive);
  }

  async getGroupChats(): Promise<Chat[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.chats.filter(chat => chat.type === 'group' && chat.isActive);
  }

  async getChatThemes(): Promise<ChatTheme[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.chatThemes;
  }

  async createChat(chatData: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chat> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newChat: Chat = {
      id: Date.now().toString(),
      ...chatData,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.chats.push(newChat);
    return newChat;
  }

  async sendMessage(chatId: string, messageData: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      ...messageData,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastMessage = newMessage;
    chat.updatedAt = new Date();

    return newMessage;
  }

  async updateChatTheme(chatId: string, themeId: string): Promise<Chat> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const chat = this.chats.find(c => c.id === chatId);
    const theme = this.chatThemes.find(t => t.id === themeId);
    
    if (!chat) throw new Error('Chat not found');
    if (!theme) throw new Error('Theme not found');

    chat.theme = theme;
    chat.updatedAt = new Date();

    return chat;
  }

  async deleteChat(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const chat = this.chats.find(c => c.id === id);
    if (!chat) {
      throw new Error('Chat not found');
    }

    chat.isActive = false;
    chat.updatedAt = new Date();
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) return;

    chat.messages.forEach(message => {
      if (message.senderId !== userId) {
        message.isRead = true;
      }
    });

    chat.updatedAt = new Date();
  }
}

export const chatService = new ChatService();