// RoleDrawer.tsx
import React from 'react';
import { Role } from '../../types/role';

interface RoleDrawerProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
}

export const RoleDrawer: React.FC<RoleDrawerProps> = ({ open, onClose, role }) => {
  if (!open || !role) return null;

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Role Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>
      <div className="p-4 space-y-2">
        <p><strong>Name:</strong> {role.name}</p>
        <p><strong>Description:</strong> {role.label}</p>
        <p><strong>Status:</strong> {role.isActive ? 'Active' : 'Inactive'}</p>
        <p><strong>Permissions:</strong></p>
        <ul className="list-disc pl-6">
          {role.permissions.map((p) => (
            <li key={p._id}>{p.permission}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
