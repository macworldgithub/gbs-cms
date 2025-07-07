import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PaletteIcon, UsersIcon, MessageSquareIcon } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { Chat, ChatTheme } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export const ChatManager: React.FC = () => {
  const { 
    chats, 
    groupChats, 
    directChats, 
    chatThemes, 
    loading, 
    error, 
    createChat, 
    updateChatTheme, 
    deleteChat 
  } = useChat();
  
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group'>('all');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleDeleteChat = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(id);
      } catch (err) {
        console.error('Failed to delete chat:', err);
      }
    }
  };

  const handleUpdateTheme = async (chatId: string, themeId: string) => {
    try {
      await updateChatTheme(chatId, themeId);
      setShowThemeSelector(false);
      setSelectedChat(null);
    } catch (err) {
      console.error('Failed to update chat theme:', err);
    }
  };

  const getDisplayChats = () => {
    switch (activeTab) {
      case 'direct':
        return directChats;
      case 'group':
        return groupChats;
      default:
        return chats;
    }
  };

  const formatLastMessage = (chat: Chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    const content = chat.lastMessage.content;
    return content.length > 50 ? `${content.substring(0, 50)}...` : content;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chat Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'default' : 'outline'}
            className={activeTab === 'all' ? 'bg-[#ec2227] hover:bg-[#d41e23]' : ''}
          >
            All Chats
          </Button>
          <Button
            onClick={() => setActiveTab('direct')}
            variant={activeTab === 'direct' ? 'default' : 'outline'}
            className={activeTab === 'direct' ? 'bg-[#ec2227] hover:bg-[#d41e23]' : ''}
          >
            Direct
          </Button>
          <Button
            onClick={() => setActiveTab('group')}
            variant={activeTab === 'group' ? 'default' : 'outline'}
            className={activeTab === 'group' ? 'bg-[#ec2227] hover:bg-[#d41e23]' : ''}
          >
            Groups
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Chats</p>
              <p className="text-2xl font-bold text-gray-900">{chats.length}</p>
            </div>
            <MessageSquareIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Direct Chats</p>
              <p className="text-2xl font-bold text-gray-900">{directChats.length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Group Chats</p>
              <p className="text-2xl font-bold text-gray-900">{groupChats.length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Select Chat Theme</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {chatThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleUpdateTheme(selectedChat.id, theme.id)}
                  className="p-3 rounded-lg border-2 hover:border-[#ec2227] transition-colors"
                  style={{
                    backgroundColor: theme.secondaryColor,
                    borderColor: selectedChat.theme.id === theme.id ? '#ec2227' : '#e5e7eb'
                  }}
                >
                  <div className="text-center">
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: theme.primaryColor }}
                    ></div>
                    <p className="text-sm font-medium" style={{ color: theme.textColor }}>
                      {theme.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowThemeSelector(false);
                  setSelectedChat(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Chats List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
          </div>
        ) : (
          getDisplayChats().map((chat) => (
            <Card key={chat.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: chat.theme.primaryColor }}
                  >
                    {chat.type === 'group' ? (
                      <UsersIcon className="w-6 h-6 text-white" />
                    ) : (
                      <MessageSquareIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {chat.type === 'group' ? chat.name : 'Direct Chat'}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        chat.type === 'group' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {chat.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatLastMessage(chat)}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {chat.participants.length} participant{chat.participants.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-500">
                        {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-500">
                        Theme: {chat.theme.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setSelectedChat(chat);
                      setShowThemeSelector(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <PaletteIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteChat(chat.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {getDisplayChats().length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No {activeTab === 'all' ? '' : activeTab} chats found.
        </div>
      )}
    </div>
  );
};