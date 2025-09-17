import React, { useState, useEffect } from "react";
import { TrashIcon, UsersIcon, MessageSquareIcon } from "lucide-react";
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

export const ChatManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "direct" | "group">("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const defaultTheme = { id: "1", name: "Default", primaryColor: "#ec2227", secondaryColor: "#f8f8f8", textColor: "#333" };
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
      console.log("Conversations API response:", response.data); // Debug log
      const conversationsData = response.data.conversations.map((conv: any) => ({
        ...conv,
        theme: defaultTheme, // Assign default theme
        participants: conv.participants || [], // Ensure participants is an array
        messages: conv.messages || [], // Ensure messages is an array
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
      console.log("Messages API response:", response.data); // Debug log
      const messagesData = (response.data.messages || []).map((msg: any) => ({
        ...msg,
        sender: msg.sender || { _id: "unknown", name: "Unknown Sender" }, // Fallback sender
        readBy: msg.readBy || [], // Ensure readBy is an array
      }));
      setMessages(messagesData);
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
    if (selectedConversation?._id) {
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
    if (!chat.messages || chat.messages.length === 0) return "No messages yet";
    const content = chat.messages[0].content;
    return content && content.length > 50 ? `${content.substring(0, 50)}...` : content || "No content";
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
                          style={{ backgroundColor: chat.theme?.primaryColor || "#ec2227" }}
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
                              {chat.isGroup
                                ? chat.groupName || "Unnamed Group"
                                : chat.participants?.length
                                  ? chat.participants.map((p) => p?.name || "Unknown").join(", ")
                                  : "No Participants"}
                            </h3>
                            <Tag color={chat.isGroup ? "blue" : "green"}>
                              {chat.isGroup ? "Group Chat" : "Direct Chat"}
                            </Tag>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{formatLastMessage(chat)}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {chat.participants?.length || 0} participant{chat.participants?.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
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
                  ? selectedConversation.groupName || "Unnamed Group"
                  : `Chat with ${selectedConversation.participants?.map((p) => p?.name || "Unknown").join(", ") || "No Participants"}`
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
                        style={{ backgroundColor: selectedConversation.theme?.secondaryColor || "#f8f8f8" }}
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {msg.sender?.name || "Unknown Sender"}
                          </p>
                          <p className="text-gray-700">{msg.content || "No content"}</p>
                          {msg.media?.map((media, idx) => (
                            <div key={idx} className="mt-2">
                              {media.type === "image" && media.signedUrl && (
                                <img
                                  src={media.signedUrl}
                                  alt="Media"
                                  className="w-32 h-32 object-cover rounded-md"
                                />
                              )}
                              {media.type === "video" && media.signedUrl && (
                                <video
                                  src={media.signedUrl}
                                  controls
                                  className="w-32 h-32 object-cover rounded-md"
                                />
                              )}
                              {media.type === "audio" && media.signedUrl && (
                                <audio src={media.signedUrl} controls className="w-32" />
                              )}
                              {media.type === "file" && media.signedUrl && (
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
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Unknown Date"}
                          </p>
                          {selectedConversation.isGroup && (
                            <p className="text-xs text-gray-400">
                              Read by: {msg.readBy?.map((user) => user?.name || "Unknown").join(", ") || "None"}
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