import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";
import { Notification } from "../types/notification";
import { NotificationCard } from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  onCreateClick: () => void;
  onEditClick: (notification: Notification) => void;
  onDeleteClick: (id: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  isLoading: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onToggleRead,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterRead, setFilterRead] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //@ts-ignore
      notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
    //@ts-ignore
      filterType === "all" || notification.type === filterType;
    const matchesPriority =
    //@ts-ignore
      filterPriority === "all" || notification.priority === filterPriority;
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "read" && notification.isRead) ||
      (filterRead === "unread" && !notification.isRead);

    return matchesSearch && matchesType && matchesPriority && matchesRead;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    byType: {
        //@ts-ignore
      info: notifications.filter((n) => n.type === "info").length,
        //@ts-ignore

      success: notifications.filter((n) => n.type === "success").length,
        //@ts-ignore

      warning: notifications.filter((n) => n.type === "warning").length,
        //@ts-ignore

      error: notifications.filter((n) => n.type === "error").length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.unread}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.byType.success}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.byType.error}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your notification system
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-600">
              {searchTerm ||
              filterType !== "all" ||
              filterPriority !== "all" ||
              filterRead !== "all"
                ? "Try adjusting your filters or search term."
                : "Create your first notification to get started."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onEdit={onEditClick}
              onDelete={onDeleteClick}
              onToggleRead={onToggleRead}
            />
          ))
        )}
      </div>
    </div>
  );
};
