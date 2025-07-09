import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SaveIcon, XIcon, ShieldIcon, UsersIcon } from 'lucide-react';
import { useRole } from '../../contexts/RoleContext';
import { usePermission } from '../../contexts/PermissionContext';
import { RoleFormData, BulkRoleData, Role, } from '../../types/role';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from "react-toastify";
import { RoleDrawer } from './RoleDrawer';

export const RoleManager: React.FC = () => {
  const { roles, loading, error, createRole, updateRole, deleteRole, addPermissionToRole, removePermissionFromRole, createBulkRoles, getRoleById } = useRole();
  const { permissions } = usePermission();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissionIds: [],
    isActive: true,
  });
  const [bulkData, setBulkData] = useState<BulkRoleData[]>([
    { name: '', description: '', permissionNames: [] }
  ]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRole, setDrawerRole] = useState<Role | null>(null);
  const openRoleDrawer = async (id: string) => {
    try {
      const roleDetails = await getRoleById(id);
      console.log("Fetched role:", roleDetails);
      setDrawerRole(roleDetails);
      setDrawerOpen(true);
    } catch (err) {
      toast.error("Failed to fetch role details");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissionIds: [],
      isActive: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRole(editingId, formData);
        toast.success("Role updated successfully");
      } else {
        await createRole(formData);
        toast.success("Role added successfully");
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save role:", err);
      toast.error("Failed to save role");
    }
  };

  const handleEdit = (role: any) => {
    setFormData({
      name: role.name,
      description: role.label,
      permissionIds: role.permissions.map((p: any) => p.permission),
      isActive: role.isActive,
    });
    setEditingId(role._id); // MongoDB ID
    setIsAdding(true);
  };



  const handleDelete = (id: string) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="font-semibold text-gray-900">
            Are you sure you want to delete this role?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={async () => {
                try {
                  await deleteRole(id);
                  toast.success("Role deleted successfully");
                } catch (err) {
                  toast.error("Failed to delete role");
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
      const validRoles = bulkData.filter(role => role.name.trim() && role.description.trim());
      if (validRoles.length === 0) {
        alert('Please provide at least one valid role');
        return;
      }

      await createBulkRoles(validRoles);
      setBulkData([{ name: '', description: '', permissionNames: [] }]);
      setShowBulkCreate(false);
    } catch (err) {
      console.error('Failed to create bulk roles:', err);
    }
  };

  const addBulkRole = () => {
    setBulkData([...bulkData, { name: '', description: '', permissionNames: [] }]);
  };

  const removeBulkRole = (index: number) => {
    setBulkData(bulkData.filter((_, i) => i !== index));
  };

  const updateBulkRole = (index: number, field: keyof BulkRoleData, value: any) => {
    const updated = [...bulkData];
    updated[index] = { ...updated[index], [field]: value };
    setBulkData(updated);
  };

  const handlePermissionToggle = (roleId: string, permissionId: string, hasPermission: boolean) => {
    if (hasPermission) {
      removePermissionFromRole(roleId, permissionId);
    } else {
      addPermissionToRole(roleId, permissionId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowBulkCreate(true)}
            variant="outline"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Bulk Create
          </Button>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
            <ShieldIcon className="w-8 h-8 text-[#ec2227]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.filter(r => r.isActive).length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Permissions</p>
              <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            </div>
            <ShieldIcon className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Bulk Create Modal */}
      {showBulkCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Bulk Create Roles</h3>
            <div className="space-y-4 mb-4">
              {bulkData.map((role, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Role {index + 1}</h4>
                    {bulkData.length > 1 && (
                      <Button
                        onClick={() => removeBulkRole(index)}
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
                      placeholder="Role name"
                      value={role.name}
                      onChange={(e) => updateBulkRole(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={role.description}
                      onChange={(e) => updateBulkRole(index, 'description', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Permission names (comma separated)"
                    value={role.permissionNames.join(', ')}
                    onChange={(e) => updateBulkRole(index, 'permissionNames', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              <Button onClick={addBulkRole} variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Another Role
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBulkCreate} className="bg-[#ec2227] hover:bg-[#d41e23]">
                Create Roles
              </Button>
              <Button onClick={() => setShowBulkCreate(false)} variant="outline">
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
            {editingId ? 'Edit Role' : 'Add New Role'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissionIds.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            permissionIds: [...formData.permissionIds, permission.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            permissionIds: formData.permissionIds.filter(id => id !== permission.id)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
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
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" onClick={resetForm} variant="outline">
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Roles List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
          </div>
        ) : (roles.map((role) => {
          //@ts-ignore
          const roleId = role._id;
          console.log("Rendering role:", role);

          return (
            <Card key={roleId} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldIcon className="w-5 h-5 text-[#ec2227]" />
                    <button
                      onClick={() => openRoleDrawer(roleId)}
                      className="font-semibold text-gray-900 hover:underline text-left"
                    >
                      {role.name}
                    </button>

                    <span className={`px-2 py-1 text-xs rounded-full ${role.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission.id}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => setSelectedRole(selectedRole === roleId ? null : roleId)}
                    variant="outline"
                    size="sm"
                  >
                    Manage Permissions
                  </Button>
                  <Button
                    onClick={() => handleEdit(role)}
                    variant="outline"
                    size="sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(roleId)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Permission Management */}
              {selectedRole === roleId && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Manage Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {permissions.map((permission) => {
                      const hasPermission = role.permissions.some(p => p.id === permission.id);
                      return (
                        <label key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            onChange={() => handlePermissionToggle(roleId, permission.id, hasPermission)}
                            className="rounded"
                          />
                          <span className="text-sm">{permission.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        }))
        }
        <RoleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} role={drawerRole} />
      </div>
    </div>
  );
};