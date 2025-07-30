import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
  ShieldCheckIcon,
  LayersIcon,
} from "lucide-react";
import { usePermission } from "../../contexts/PermissionContext";
import { PermissionFormData, BulkPermissionData } from "../../types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "react-toastify";
import { PermissionDrawer } from "./PermissionDrawer";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../types";
import axios from "axios";

export const PermissionManager: React.FC = () => {
  const {
    permissions,
    loading,
    error,
    createPermission,
    updatePermission,
    deletePermission,
    createBulkPermissions,
  } = usePermission();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  const [filterResource, setFilterResource] = useState("");
  const [formData, setFormData] = useState<PermissionFormData>({
    name: "",
    description: "",
    resource: "",
    action: "",
    isActive: true,
  });
  const [bulkData, setBulkData] = useState<BulkPermissionData[]>([
    //@ts-ignore
    { name: "", label: "" },
    //@ts-ignore

    { name: "", label: "" }, // Start with 2 rows
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPermission, setDrawerPermission] = useState<Permission | null>(
    null
  );
  const [drawerLoading, setDrawerLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      resource: "",
      action: "",
      isActive: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePermission(editingId, formData);
        toast.success("Permission updated successfully");
      } else {
        await createPermission(formData);
        toast.success("Permission added successfully");
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save permission:", err);
      toast.error("Failed to save permission");
    }
  };

  const handleEdit = (permission: any) => {
    setFormData({
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      isActive: permission.isActive,
    });
    setEditingId(permission.id || permission._id); // Use id or _id
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting permission with id:", id);
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="font-semibold text-gray-900">
            Are you sure you want to delete this permission?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={async () => {
                try {
                  await deletePermission(id);
                  toast.success("Permission deleted successfully");
                } catch (err) {
                  toast.error("Failed to delete permission");
                } finally {
                  closeToast?.();
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        closeOnClick: false,
        closeButton: false,
        autoClose: false,
        draggable: false,
      }
    );
  };

  const handleBulkCreate = async () => {
    try {
      const validPermissions = bulkData.filter(
        //@ts-ignore
        (perm) => perm.name.trim() && perm.label.trim()
      );

      if (validPermissions.length < 2) {
        alert("Please provide at least two valid permissions");
        return;
      }

      await axios.post(
        "http://192.168.100.45:9000/permissions/bulk",
        validPermissions,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setBulkData([
        //@ts-ignore
        { name: "", label: "" },
        //@ts-ignore
        { name: "", label: "" },
      ]);
      setShowBulkCreate(false);
    } catch (err) {
      console.error("Failed to create bulk permissions:", err);
    }
  };

  const addBulkPermission = () => {
    //@ts-ignore
    setBulkData([...bulkData, { name: "", label: "" }]);
  };

  const removeBulkPermission = (index: number) => {
    if (bulkData.length > 2) {
      setBulkData(bulkData.filter((_, i) => i !== index));
    }
  };

  const updateBulkPermission = (
    index: number,
    field: keyof BulkPermissionData,
    value: string
  ) => {
    const updated = [...bulkData];
    updated[index] = { ...updated[index], [field]: value };
    setBulkData(updated);
  };

  const handlePermissionClick = async (permissionId: string) => {
    setDrawerLoading(true);
    setDrawerOpen(true);
    try {
      const permission = await permissionService.getPermissionById(
        permissionId
      );
      setDrawerPermission(permission);
    } catch (err) {
      setDrawerPermission(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  const filteredPermissions = filterResource
    ? permissions.filter((p) => p.resource === filterResource)
    : permissions;

  const resources = [...new Set(permissions.map((p) => p.resource))];
  const actions = [...new Set(permissions.map((p) => p.action))];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Permission Management
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowBulkCreate(true)} variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Bulk Create
          </Button>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Permission
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Permission Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Permissions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {permissions.length}
              </p>
            </div>
            <ShieldCheckIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resources</p>
              <p className="text-2xl font-bold text-gray-900">
                {resources.length}
              </p>
            </div>
            <LayersIcon className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {actions.length}
              </p>
            </div>
            <LayersIcon className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {permissions.filter((p) => p.isActive).length}
              </p>
            </div>
            <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
          >
            <option value="">All Resources</option>
            {resources.map((resource) => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Bulk Create Modal */}
      {showBulkCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Bulk Create Permissions
            </h3>
            <div className="space-y-4 mb-4">
              {bulkData.map((permission, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">
                      Permission {index + 1}
                    </h4>
                    {bulkData.length > 2 && (
                      <Button
                        onClick={() => removeBulkPermission(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Permission name"
                      value={permission.name}
                      onChange={(e) =>
                        updateBulkPermission(index, "name", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      //@ts-ignore
                      value={permission.label}
                      onChange={(e) =>
                        //@ts-ignore
                        updateBulkPermission(index, "label", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              <Button onClick={addBulkPermission} variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Another Permission
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleBulkCreate}
                className="bg-[#ec2227] hover:bg-[#d41e23]"
              >
                Create Permissions
              </Button>
              <Button
                onClick={() => setShowBulkCreate(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="p-6 mb-6 border-2 border-[#ec2227]">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Permission" : "Add New Permission"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  placeholder="e.g., users.create"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  placeholder="e.g., Create new users"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource
                </label>
                <input
                  type="text"
                  value={formData.resource}
                  onChange={(e) =>
                    setFormData({ ...formData, resource: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  placeholder="e.g., users, events, chats"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <input
                  type="text"
                  value={formData.action}
                  onChange={(e) =>
                    setFormData({ ...formData, action: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  placeholder="e.g., create, read, update, delete"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                Active
              </label>
            </div>

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
        </Card>
      )}

      {/* Permissions List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
          </div>
        ) : (
          filteredPermissions.map((permission: any) => (
            <Card
              key={permission.id}
              className="p-4 cursor-pointer hover:bg-gray-50 transition"
              onClick={() =>
                handlePermissionClick(permission.id || permission._id)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheckIcon className="w-5 h-5 text-[#ec2227]" />
                    <h3 className="font-semibold text-gray-900">
                      {permission.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {permission.description}
                  </p>
                  <div className="flex gap-2">
                    {/* Optional tags for resource/action can go here */}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(permission);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(permission.id || permission._id);
                    }}
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

      <PermissionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        permission={drawerPermission}
        loading={drawerLoading}
      />
    </div>
  );
};
