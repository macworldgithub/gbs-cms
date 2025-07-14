import React from "react";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Clock,
  Users,
  Edit,
  Trash2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Notification } from "../types/notification";

interface NotificationCardProps {
  notification: Notification;
  onEdit: (notification: Notification) => void;
  onDelete: (id: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onEdit,
  onDelete,
  onToggleRead,
}) => {
  const isExpired = new Date(notification.endDate) < new Date();
  const isActive =
    new Date(notification.startDate) <= new Date() &&
    new Date(notification.endDate) >= new Date();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCoordinatesSummary = () => {
    // Check if notification.area exists and has coordinates
    const allPolygons = notification?.area?.coordinates;

    if (!Array.isArray(allPolygons) || allPolygons.length === 0) {
      return "No coordinates available";
    }

    // Map over each polygon in the coordinates array
    const summaries = allPolygons.map((polygon, index) => {
      const coords = polygon[0]; // First ring of polygon
      if (!coords || coords.length === 0)
        return `Polygon ${index + 1}: No points`;

      return `Polygon ${index + 1}: ${
        coords.length - 1
      } points (${coords[0][0]?.toFixed(3)}, ${coords[0][1]?.toFixed(3)})`;
    });

    return summaries.join(" | ");
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg border-2 shadow-sm transition-all duration-200
        hover:shadow-md ${
          notification.isRead ? "opacity-75" : "ring-2 ring-blue-100"
        }
      
      `}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${
                isActive
                  ? "bg-green-100"
                  : isExpired
                  ? "bg-gray-100"
                  : "bg-blue-100"
              }
            `}
            >
              <Bell className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {notification.title}
                </h3>
                <span
                  className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                   bg-current bg-opacity-10
                `}
                ></span>
              </div>

              <p className="text-gray-600 mb-3 leading-relaxed">
                {notification.message}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500">
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {formatDate(notification.startDate)}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>End: {formatDate(notification.endDate)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{getCoordinatesSummary()}</span>
                  </div>

                  {notification.roles.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{notification.roles.length} role(s)</span>
                    </div>
                  )}

                  {notification.sentTo.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Bell className="w-4 h-4" />
                      <span>{notification.sentTo.length} recipient(s)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() =>
                onToggleRead(notification._id, !notification.isRead)
              }
              className={`
                p-2 rounded-full transition-colors
                ${
                  notification.isRead
                    ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                }
              `}
              title={notification.isRead ? "Mark as unread" : "Mark as read"}
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEdit(notification)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Edit notification"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(notification._id)}
              className="p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete notification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
