import React, { useState, useEffect } from "react";
import {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../../types/notification";
import { notificationService } from "../../services/notificationService";
import { NotificationList } from "../../components/NotificationList";
import { NotificationForm } from "../../components/NotificationForm";

function NotificationMain() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await notificationService.findAll();
      setNotifications(data);
    } catch (err) {
      setError(
        "Failed to fetch notifications. Please check your API connection."
      );
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreateNotification = async (dto: CreateNotificationDto) => {
    try {
      setIsSubmitting(true);
      const newNotification = await notificationService.create(dto);
      setNotifications((prev) => [newNotification, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError("Failed to create notification");
      console.error("Error creating notification:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNotification = async (dto: UpdateNotificationDto) => {
    if (!editingNotification) return;

    try {
      setIsSubmitting(true);
      const updatedNotification = await notificationService.update(
        editingNotification._id,
        dto
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === editingNotification._id
            ? updatedNotification
            : notification
        )
      );
      setEditingNotification(null);
      setShowForm(false);
    } catch (err) {
      setError("Failed to update notification");
      console.error("Error updating notification:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const response = await notificationService.delete(id);

      // Check if response status is 204 (No Content) and handle accordingly
      if (response.status === 204) {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== id)
        );
      } else {
        setError("Unexpected response when deleting notification.");
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      // This will now only be triggered in case of an actual error (e.g., network error)
      setError("Failed to delete notification");
      console.error("Error deleting notification:", err);
    }
  };

  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      const updatedNotification = await notificationService.update(id, {
        isRead,
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? updatedNotification : notification
        )
      );
    } catch (err) {
      setError("Failed to update notification status");
      console.error("Error updating notification status:", err);
    }
  };

  const handleCreateClick = () => {
    setEditingNotification(null);
    setShowForm(true);
  };

  const handleEditClick = (notification: Notification) => {
    setEditingNotification(notification);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingNotification(null);
  };

  const handleFormSubmit = (
    dto: CreateNotificationDto | UpdateNotificationDto
  ) => {
    if (editingNotification) {
      handleUpdateNotification(dto as UpdateNotificationDto);
    } else {
      handleCreateNotification(dto as CreateNotificationDto);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <NotificationList
          notifications={notifications}
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteNotification}
          onToggleRead={handleToggleRead}
          isLoading={isLoading}
        />

        {showForm && (
          <NotificationForm
            //@ts-ignore
            notification={editingNotification}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default NotificationMain;
