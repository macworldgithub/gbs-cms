
import React, { useState, useEffect } from "react";
import { TrashIcon, PaletteIcon, UsersIcon, MessageSquareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input, Tag } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { VITE_API_BASE_URL as API_BASE_URL, AUTH_TOKEN } from "../../utils/config/server";

interface Participant {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  content: string;
  media?: { key: string; type: "image" | "video" | "audio" | "file"; signedUrl?: string }[];
  createdAt: string;
  isRead: boolean;
  readBy: { _id: string; name: string }[];
}

interface Conversation {
  _id: string;
  participants: Participant[];
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  messages: Message[];
  theme: { id: string; name: string; primaryColor: string; secondaryColor: string; textColor: string };
}

interface ChatTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

export const ChatManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "direct" | "group">("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatThemes] = useState<ChatTheme[]>([
    { id: "1", name: "Default", primaryColor: "#ec2227", secondaryColor: "#f8f8f8", textColor: "#333" },
    { id: "2", name: "Dark", primaryColor: "#1f2937", secondaryColor: "#374151", textColor: "#fff" },
    { id: "3", name: "Blue", primaryColor: "#2563eb", secondaryColor: "#dbeafe", textColor: "#1e40af" },
  ]);
  const [page, setPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [limit] = useState(10);
  const [totalConversations, setTotalConversations] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");

  // Fetch all conversations
  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (keyword) params.append("keyword", keyword);

      const response = await axios.get(
        `${API_BASE_URL}/messages/admin/conversations?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );
      const conversationsData = response.data.conversations.map((conv: any) => ({
        ...conv,
        theme: chatThemes[0], // Assign default theme (mock, adjust as needed)
      }));
      setConversations(conversationsData);
      setTotalConversations(response.data.total || 0);
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      setError("Failed to fetch conversations");
      toast.error("Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a selected conversation
  const fetchMessages = async (conversationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/admin/conversation/${conversationId}/messages?page=${messagePage}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );
      setMessages(response.data.messages || []);
      setTotalMessages(response.data.total || 0);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages");
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  // Delete messages (for group chats only)
  const handleDeleteMessages = async (conversationId: string, messageIds: string[]) => {
    if (!window.confirm("Are you sure you want to delete the selected messages?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/messages/admin/conversation/${conversationId}/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        data: { conversationId, messageIds },
      });
      setMessages((prev) => prev.filter((msg) => !messageIds.includes(msg._id)));
      toast.success("Messages deleted successfully");
    } catch (error: any) {
      console.error("Error deleting messages:", error.response?.data || error.message);
      toast.error("Failed to delete messages");
    }
  };

  // Delete a chat
  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      // Assuming a DELETE endpoint for conversations (not provided, so mock response)
      await axios.delete(`${API_BASE_URL}/messages/admin/conversation/${chatId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      setConversations((prev) => prev.filter((conv) => conv._id !== chatId));
      if (selectedConversation?._id === chatId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      toast.success("Chat deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete chat:", error);
      setError("Failed to delete chat");
      toast.error("Failed to delete chat");
    }
  };

  // Update chat theme
  const handleUpdateTheme = async (chatId: string, themeId: string) => {
    try {
      const theme = chatThemes.find((t) => t.id === themeId);
      if (!theme) throw new Error("Theme not found");
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === chatId ? { ...conv, theme } : conv
        )
      );
      setShowThemeSelector(false);
      setSelectedConversation(null);
      toast.success("Chat theme updated successfully");
    } catch (error: any) {
      console.error("Failed to update chat theme:", error);
      setError("Failed to update chat theme");
      toast.error("Failed to update chat theme");
    }
  };

  // Handle conversation click
  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessagePage(1);
    fetchMessages(conversation._id);
  };

  useEffect(() => {
    fetchConversations();
  }, [page, keyword]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [messagePage, selectedConversation]);

  const getDisplayChats = () => {
    switch (activeTab) {
      case "direct":
        return conversations.filter((conv) => !conv.isGroup);
      case "group":
        return conversations.filter((conv) => conv.isGroup);
      default:
        return conversations;
    }
  };

  const formatLastMessage = (chat: Conversation) => {
    if (!chat.messages.length) return "No messages yet";
    const content = chat.messages[0].content;
    return content.length > 50 ? `${content.substring(0, 50)}...` : content;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chat Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("all")}
            variant={activeTab === "all" ? "default" : "outline"}
            className={activeTab === "all" ? "bg-[#ec2227] hover:bg-[#d41e23]" : ""}
          >
            All Chats
          </Button>
          <Button
            onClick={() => setActiveTab("direct")}
            variant={activeTab === "direct" ? "default" : "outline"}
            className={activeTab === "direct" ? "bg-[#ec2227] hover:bg-[#d41e23]" : ""}
          >
            Direct
          </Button>
          <Button
            onClick={() => setActiveTab("group")}
            variant={activeTab === "group" ? "default" : "outline"}
            className={activeTab === "group" ? "bg-[#ec2227] hover:bg-[#d41e23]" : ""}
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
              <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
            </div>
            <MessageSquareIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Direct Chats</p>
              <p className="text-2xl font-bold text-gray-900">{conversations.filter((c) => !c.isGroup).length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Group Chats</p>
              <p className="text-2xl font-bold text-gray-900">{conversations.filter((c) => c.isGroup).length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Select Chat Theme</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {chatThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleUpdateTheme(selectedConversation._id, theme.id)}
                  className="p-3 rounded-lg border-2 hover:border-[#ec2227] transition-colors"
                  style={{
                    backgroundColor: theme.secondaryColor,
                    borderColor: selectedConversation.theme.id === theme.id ? "#ec2227" : "#e5e7eb",
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
                  setSelectedConversation(null);
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

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Conversations List */}
        <div className="col-span-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h3>
            <Input
              placeholder="Search by group name or participant"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="mb-4 border border-black rounded-md"
            />
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
              </div>
            ) : (
              <>
                {getDisplayChats().map((chat) => (
                  <Card key={chat._id} className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => handleConversationClick(chat)}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: chat.theme.primaryColor }}
                        >
                          {chat.isGroup ? (
                            <UsersIcon className="w-6 h-6 text-white" />
                          ) : (
                            <MessageSquareIcon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {chat.isGroup ? chat.groupName : chat.participants.map((p) => p.name).join(", ")}
                            </h3>
                            <Tag color={chat.isGroup ? "blue" : "green"}>
                              {chat.isGroup ? "Group Chat" : "Direct Chat"}
                            </Tag>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{formatLastMessage(chat)}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {chat.participants.length} participant{chat.participants.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-xs text-gray-500">
                              {chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-xs text-gray-500">Theme: {chat.theme.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setSelectedConversation(chat);
                            setShowThemeSelector(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <PaletteIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteChat(chat._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {getDisplayChats().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {activeTab === "all" ? "" : activeTab} chats found.
                  </div>
                )}
                {/* Pagination for Conversations */}
                <div className="flex justify-between mt-4">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={page * limit >= totalConversations}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Messages Panel */}
        <div className="col-span-8">
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedConversation
                ? selectedConversation.isGroup
                  ? selectedConversation.groupName
                  : `Chat with ${selectedConversation.participants.map((p) => p.name).join(", ")}`
                : "Select a conversation"}
            </h3>
            {selectedConversation ? (
              <>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-start"
                        style={{ backgroundColor: selectedConversation.theme.secondaryColor }}
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{msg.sender.name}</p>
                          <p className="text-gray-700">{msg.content}</p>
                          {msg.media?.map((media, idx) => (
                            <div key={idx} className="mt-2">
                              {media.type === "image" && (
                                <img
                                  src={media.signedUrl}
                                  alt="Media"
                                  className="w-32 h-32 object-cover rounded-md"
                                />
                              )}
                              {media.type === "video" && (
                                <video
                                  src={media.signedUrl}
                                  controls
                                  className="w-32 h-32 object-cover rounded-md"
                                />
                              )}
                              {media.type === "audio" && (
                                <audio src={media.signedUrl} controls className="w-32" />
                              )}
                              {media.type === "file" && (
                                <a
                                  href={media.signedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View File
                                </a>
                              )}
                            </div>
                          ))}
                          <p className="text-xs text-gray-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                          {selectedConversation.isGroup && (
                            <p className="text-xs text-gray-400">
                              Read by: {msg.readBy.map((user) => user.name).join(", ") || "None"}
                            </p>
                          )}
                        </div>
                        {selectedConversation.isGroup && (
                          <Button
                            onClick={() => handleDeleteMessages(selectedConversation._id, [msg._id])}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No messages found</p>
                )}
                {/* Pagination for Messages */}
                <div className="flex justify-between mt-4">
                  <Button
                    disabled={messagePage === 1}
                    onClick={() => setMessagePage((prev) => prev - 1)}
                    className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={messagePage * limit >= totalMessages}
                    onClick={() => setMessagePage((prev) => prev + 1)}
                    className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Select a conversation to view messages</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};