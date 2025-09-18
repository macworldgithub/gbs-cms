import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useEvent } from "../../contexts/EventContext";
import { eventService } from "../../services/eventService";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const EventEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, updateEvent, loading } = useEvent();
  const [formData, setFormData] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch roles first
    eventService.fetchRoles(localStorage.getItem("token") || "").then(setRoles);
  }, []);

  useEffect(() => {
    if (!id || !events.length || !roles.length) return; // Wait for both events and roles to load
    const event = events.find((e) => e.id === id || e._id === id);
    if (event) {
      setFormData(event);
      setSelectedRoles(
        event.roles.map((roleId: string) => {
          const roleObj = roles.find((r) => r._id === roleId);
          return {
            value: roleId,
            label: roleObj ? roleObj.label || roleObj.name : roleId,
          };
        })
      );
    }
  }, [id, events, roles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEvent(id!, {
      ...formData,
      roles: selectedRoles.map((r) => r.value),
    });
    navigate("/admin/events");
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Card className="p-6 mb-6 border-2 border-[#ec2227]">
        <h3 className="text-lg font-semibold mb-4">Edit Event</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ...other fields... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roles
            </label>
            <Select
              isMulti
              options={roles.map((role) => ({
                value: role._id,
                label: role.label || role.name,
              }))}
              value={selectedRoles}
              onChange={setSelectedRoles}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select roles..."
            />
          </div>
          <Button type="submit" disabled={loading}>
            Update
          </Button>
        </form>
      </Card>
    </div>
  );
};
