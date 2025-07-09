import React, { useState, useEffect } from "react";
import { X, Plus, Minus, MapPin } from "lucide-react";
import {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../types/notification";
import MapboxPolygonDrawer from "./MapBoxPolygonDrawer";
import { RoleSelector } from "./RoleSelector";

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
      coordinates: [
        [
          [73.056, 33.684],
          [73.057, 33.685],
          [73.058, 33.684],
          [73.056, 33.684],
        ],
      ],
    },
    roles: [""],
    startDate: "",
    endDate: "",
  });

  const [coordinateInput, setCoordinateInput] = useState("");
  const [mapboxCoordinates, setMapboxCoordinates] = useState("");

  console.log("ly check", notification);

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        //@ts-ignore
        area: notification.area,
        roles: notification.roles.length > 0 ? notification.roles : [""],
        startDate: notification.startDate
          ? notification.startDate.split("T")[0] +
            "T" +
            notification.startDate.split("T")[1].substring(0, 5)
          : "",
        endDate: notification.endDate
          ? notification.endDate.split("T")[0] +
            "T" +
            notification.endDate.split("T")[1].substring(0, 5)
          : "",
      });

      // Convert coordinates back to string format
      //@ts-ignore
      let coordString = notification.area.coordinates[0]
        .map((coord) => `${coord[0]},${coord[1]}`)
        .join(";");
      setCoordinateInput(coordString);

      // Set mapbox coordinates
      setMapboxCoordinates(JSON.stringify(notification.area.coordinates));
      // Convert coordinates back to string format
      //@ts-ignore
      coordString = notification.area.coordinates[0]
        .map((coord) => `${coord[0]},${coord[1]}`)
        .join(";");
      setCoordinateInput(coordString);

      // Set mapbox coordinates
      setMapboxCoordinates(JSON.stringify(notification.area.coordinates));
    } else {
      // Set default coordinates for new notifications
      //@ts-ignore
      let defaultCoords = [
        [
          [73.056, 33.684],
          [73.057, 33.685],
          [73.058, 33.684],
          [73.056, 33.684],
        ],
      ];
      setMapboxCoordinates(JSON.stringify(defaultCoords));
      setCoordinateInput(
        "73.056,33.684;73.057,33.685;73.058,33.684;73.056,33.684"
      );
      // Set default coordinates for new notifications
      //@ts-ignore
      defaultCoords = [
        [
          [73.056, 33.684],
          [73.057, 33.685],
          [73.058, 33.684],
          [73.056, 33.684],
        ],
      ];
      setMapboxCoordinates(JSON.stringify(defaultCoords));
      setCoordinateInput(
        "73.056,33.684;73.057,33.685;73.058,33.684;73.056,33.684"
      );
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
                  Geographical Area (Draw Polygon)
                </label>
                <MapboxPolygonDrawer
                  coordinates={mapboxCoordinates}
                  setCoordinates={handleMapboxCoordinateChange}
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manual Coordinates (Optional)
                </label>
                <textarea
                  value={coordinateInput}
                  onChange={(e) => handleCoordinateChange(e.target.value)}
                  rows={3}
                  placeholder="73.056,33.684;73.057,33.685;73.058,33.684;73.056,33.684"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can also manually enter coordinates as:
                  lng,lat;lng,lat;lng,lat
                </p>
              </div> */}
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
