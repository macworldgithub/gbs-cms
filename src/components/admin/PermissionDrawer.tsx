import React from 'react';
import { Permission } from '../../types';

interface PermissionDrawerProps {
  open: boolean;
  onClose: () => void;
  permission: Permission | null;
  loading?: boolean;
}

export const PermissionDrawer: React.FC<PermissionDrawerProps> = ({ open, onClose, permission, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Permission Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
      </div>
      <div className="p-4 space-y-2">
        {loading ? (
          <div>Loading...</div>
        ) : permission ? (
          <>
            <p><strong>Name:</strong> {permission.name}</p>
            <p><strong>Label: </strong>{permission.label}</p>
            {/* <p><strong>Description:</strong> {permission.description}</p> */}
            {/* <p><strong>Resource:</strong> {permission.resource}</p> */}
            {/* <p><strong>Action:</strong> {permission.action}</p> */}
            {/* <p><strong>Status:</strong> {permission.isActive ? 'Active' : 'Inactive'}</p> */}
            <p><strong>Created At:</strong> {new Date(permission.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(permission.updatedAt).toLocaleString()}</p>
          </>
        ) : (
          <div>Permission not found.</div>
        )}
      </div>
    </div>
  );
};
