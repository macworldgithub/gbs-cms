import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  StarIcon,
} from "lucide-react";
import { useEvent } from "../../contexts/EventContext";
import { Event, EventStatus } from "../../types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { eventService } from "../../services/eventService";

export const EventManager: React.FC = () => {
  const {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    bookEvent,
    toggleFeatured,
  } = useEvent();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    state: "VIC",
    openToAll: true,
    startDate: new Date(),
    endDate: new Date(),
    area: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [151.2093, -33.8688],
            [151.2094, -33.8689],
            [151.2095, -33.8688],
            [151.2093, -33.8688],
          ],
        ],
      ],
    },
    roles: [],
    isPopular: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [roles, setRoles] = useState<
    { _id: string; name: string; label: string }[]
  >([]);
  const [selectedRoleNames, setSelectedRoleNames] = useState<string[]>([]);

  // Hardcoded GeoJSON options (fallback for map-based selection)
  const geoJsonOptions = [
    {
      label: "Sydney CBD",
      value: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [151.2093, -33.8688],
              [151.2094, -33.8689],
              [151.2095, -33.8688],
              [151.2093, -33.8688],
            ],
          ],
        ],
      },
    },
    {
      label: "Melbourne CBD",
      value: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [144.9631, -37.8136],
              [144.9632, -37.8137],
              [144.9633, -37.8136],
              [144.9631, -37.8136],
            ],
          ],
        ],
      },
    },
    {
      label: "Brisbane CBD",
      value: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [153.0251, -27.4698],
              [153.0252, -27.4699],
              [153.0253, -27.4698],
              [153.0251, -27.4698],
            ],
          ],
        ],
      },
    },
  ];

  useEffect(() => {
    setFilteredEvents(events);
    // Fetch roles on component mount
    const token = localStorage.getItem("token") || "";
    eventService
      .fetchRoles(token)
      .then((roles) => setRoles(roles))
      .catch((err) => console.error("Failed to fetch roles:", err));
  }, [events]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      state: "VIC",
      openToAll: true,
      startDate: new Date(),
      endDate: new Date(),
      area: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [151.2093, -33.8688],
              [151.2094, -33.8689],
              [151.2095, -33.8688],
              [151.2093, -33.8688],
            ],
          ],
        ],
      },
      roles: [],
      isPopular: false,
    });
    setFile(null);
    setSelectedRoleNames([]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map selected role names to role IDs
      const selectedRoleIds = roles
        .filter((role) => selectedRoleNames.includes(role.name))
        .map((role) => role._id);

      const eventData = {
        ...formData,
        roles: selectedRoleIds,
      };

      if (editingId) {
        await updateEvent(editingId, eventData, file);
      } else {
        await addEvent(eventData as any, file);
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save event:", err);
      alert(err instanceof Error ? err.message : "Failed to save event");
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      state: event.state,
      openToAll: event.openToAll,
      startDate: event.startDate,
      endDate: event.endDate,
      area: event.area,
      roles: event.roles,
      isPopular: event.isPopular,
    });
    // Set selected role names based on event.roles
    const roleNames = roles
      .filter((role) => event.roles.includes(role._id))
      .map((role) => role.name);
    setSelectedRoleNames(roleNames);
    setFile(null);
    setEditingId(event.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert(err instanceof Error ? err.message : "Failed to delete event");
      }
    }
  };

  const handleSearch = async () => {
    try {
      const searchResults = await searchEvents(
        searchQuery,
        stateFilter !== "All" ? stateFilter : undefined
      );
      setFilteredEvents(searchResults);
    } catch (err) {
      console.error("Failed to search events:", err);
      alert("Failed to search events");
    }
  };

  const handleBook = async (id: string) => {
    try {
      await bookEvent(id);
    } catch (err) {
      console.error("Failed to book event:", err);
      alert(err instanceof Error ? err.message : "Failed to book event");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleFeatured(id, !current);
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      alert("Failed to toggle featured status");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
          />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
          >
            <option value="All">All States</option>
            <option value="VIC">VIC</option>
            <option value="NSW">NSW</option>
            <option value="QLD">QLD</option>
            <option value="SA">SA</option>
            <option value="WA">WA</option>
          </select>
          <Button onClick={handleSearch} variant="outline">
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Add/Edit Form as Modal */}
      {/* Add/Edit Form as Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Blur */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={resetForm} // Clicking outside closes modal
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Event" : "Add New Event"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    required
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    required
                  >
                    <option value="VIC">VIC</option>
                    <option value="NSW">NSW</option>
                    <option value="QLD">QLD</option>
                    <option value="SA">SA</option>
                    <option value="WA">WA</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate?.toISOString().slice(0, 16)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate?.toISOString().slice(0, 16)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    required
                  />
                </div>

                {/* GeoJSON */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GeoJSON Area (Select Location)
                  </label>
                  <select
                    value={JSON.stringify(formData.area)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        area: JSON.parse(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    required
                  >
                    {geoJsonOptions.map((option) => (
                      <option
                        key={option.label}
                        value={JSON.stringify(option.value)}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Roles */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roles
                  </label>
                  <select
                    multiple
                    value={selectedRoleNames}
                    onChange={(e) =>
                      setSelectedRoleNames(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        )
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  >
                    {roles.map((role) => (
                      <option key={role._id} value={role.name}>
                        {role.label || role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  rows={3}
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="openToAll"
                    checked={formData.openToAll}
                    onChange={(e) =>
                      setFormData({ ...formData, openToAll: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="openToAll"
                    className="text-sm font-medium text-gray-700"
                  >
                    Open to All
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) =>
                      setFormData({ ...formData, isPopular: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="isPopular"
                    className="text-sm font-medium text-gray-700"
                  >
                    Featured
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
                  disabled={loading}
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  {editingId ? "Update" : "Save"}
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {event.location.city}, {event.location.country} (
                        {event.state})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {event.startDate.toLocaleDateString()} -{" "}
                        {event.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Attendees: {event.attendees.length}
                      </span>
                    </div>
                    <div className="mt-1">
                      {/* <span className="text-sm text-gray-500">
                        Organizer: {event.organizer.name} ({event.organizer.email})
                      </span> */}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          event.status === "live"
                            ? "bg-red-100 text-red-800"
                            : event.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {event.status}
                      </span>
                      {event.isPopular && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {event.openToAll
                          ? "Open to All"
                          : `Restricted (Roles: ${event.roles
                              .map(
                                (id) =>
                                  roles.find((r) => r._id === id)?.label || id
                              )
                              .join(", ")})`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(event)}
                    variant="outline"
                    size="sm"
                    title="Edit Event"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(event.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    title="Delete Event"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                  {/* <Button
                    onClick={() => handleBook(event.id)}
                    variant="outline"
                    size="sm"
                    title="Book Event"
                  >
                    Book
                  </Button> */}
                  <Button
                    onClick={() =>
                      handleToggleFeatured(event.id, event.isPopular)
                    }
                    variant="outline"
                    size="sm"
                    title={
                      event.isPopular ? "Unfeature Event" : "Feature Event"
                    }
                  >
                    <StarIcon
                      className={`w-4 h-4 ${
                        event.isPopular ? "text-yellow-500" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
