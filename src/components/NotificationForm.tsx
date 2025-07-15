import React, { useState, useEffect } from "react";
import { X, Plus, Minus, MapPin } from "lucide-react";
import {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../types/notification";
import MapboxPolygonDrawer from "./MapBoxPolygonDrawer";
import { RoleSelector } from "./RoleSelector";
import GlobeView from "./GlobeView";

interface NotificationFormProps {
  notification?: Notification;
  onSubmit: (data: CreateNotificationDto | UpdateNotificationDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  notification,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    area: {
      type: "MultiPolygon" as const,
      coordinates: [],
    },
    roles: [""],
    startDate: "",
    endDate: "",
    SendToAll: false, // Add this field for SendToAll
  });

  const [coordinateInput, setCoordinateInput] = useState("");
  const [mapboxCoordinates, setMapboxCoordinates] = useState("");

  useEffect(() => {
    if (notification) {
      const { title, message, area, roles, startDate, endDate, SendToAll } =
        notification;

      setFormData({
        title,
        message,
        area,
        roles: roles.length > 0 ? roles : [""],
        startDate: startDate
          ? `${startDate.split("T")[0]}T${startDate
              .split("T")[1]
              .substring(0, 5)}`
          : "",
        endDate: endDate
          ? `${endDate.split("T")[0]}T${endDate.split("T")[1].substring(0, 5)}`
          : "",
        SendToAll: SendToAll || false,
      });

      // Temporarily remove polygon data if SendToAll is true
      if (SendToAll) {
        setMapboxCoordinates("[]");
        setCoordinateInput("");
      } else {
        const firstPolygon = area.coordinates?.[0]?.[0];
        if (firstPolygon) {
          const coordString = firstPolygon
            .map((coord: number[]) => `${coord[0]},${coord[1]}`)
            .join(";");
          setCoordinateInput(coordString);
        }

        setMapboxCoordinates(JSON.stringify(area.coordinates));
      }
    } else {
      setFormData({
        title: "",
        message: "",
        area: { type: "MultiPolygon", coordinates: [] },
        roles: [""],
        startDate: "",
        endDate: "",
        SendToAll: false,
      });

      setMapboxCoordinates("[]");
      setCoordinateInput("");
    }
  }, [notification]);

  const handleMapboxCoordinateChange = (coords: string) => {
    setMapboxCoordinates(coords);

    if (coords) {
      try {
        const parsed = JSON.parse(coords);
        const coordString = parsed[0]
          .map((coord: number[]) => `${coord[0]},${coord[1]}`)
          .join(";");
        setCoordinateInput(coordString);
        setFormData((prev) => ({
          ...prev,
          area: { type: "MultiPolygon", coordinates: parsed },
        }));
      } catch (error) {
        console.warn("Invalid mapbox coordinates");
      }
    } else {
      // 🛠️ Ensure valid empty GeoJSON object is always sent
      setCoordinateInput("");
      setFormData((prev) => ({
        ...prev,
        area: { type: "MultiPolygon", coordinates: [] }, // ✅ safe empty structure
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      roles: formData.roles
        //@ts-ignore
        .map((role) => (typeof role === "object" ? role._id : role))
        .filter((id) => typeof id === "string" && id.trim() !== ""),
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : new Date().toISOString(),
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    //@ts-ignore
    onSubmit(data);
  };

  const handleRoleChange = (roleIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      roles: roleIds,
    }));
  };

  const handleSendToAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    // Update form data
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        SendToAll: checked,
      };

      // If SendToAll is checked, remove the area or keep it if there's valid data
      if (checked) {
        updatedData.area = undefined; // Don't send area when no valid coordinates exist
      } else {
        // If unchecked, restore coordinates if they exist
        if (notification?.area?.coordinates?.length > 0) {
          updatedData.area = notification.area; // Restore the original area with valid coordinates
        } else {
          updatedData.area = undefined; // Ensure it's removed if no coordinates exist
        }
      }

      return updatedData;
    });

    // If unchecked, restore coordinates if they exist in the notification
    if (!checked && notification?.area?.coordinates?.length > 0) {
      const coordString = notification.area.coordinates[0]
        .map((coord: number[]) => `${coord[0]},${coord[1]}`)
        .join(";");
      setCoordinateInput(coordString);
      setMapboxCoordinates(JSON.stringify(notification.area.coordinates));
    } else {
      setCoordinateInput("");
      setMapboxCoordinates("[]");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {notification ? "Edit Notification" : "Create New Notification"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Water Supply Alert"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="e.g., Water supply will be interrupted between 10 AM and 2 PM."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To World
                </label>
                <input
                  type="checkbox"
                  checked={formData.SendToAll}
                  onChange={handleSendToAllChange}
                  className="h-4 w-4 text-blue-600"
                />
              </div>

              <RoleSelector
                selectedRoleIds={formData.roles}
                onRoleChange={handleRoleChange}
                placeholder="Select roles for this notification..."
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {formData.SendToAll
                    ? "Geographical Area (View Globe)"
                    : "Geographical Area (Draw Polygon)"}
                </label>
                {!formData.SendToAll ? (
                  <MapboxPolygonDrawer
                    coordinates={mapboxCoordinates}
                    setCoordinates={handleMapboxCoordinateChange}
                  />
                ) : (
                  <GlobeView />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Saving..." : notification ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
