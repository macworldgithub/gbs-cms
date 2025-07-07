import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, RoleContextType, RoleFormData, BulkRoleData } from '../types';
import { roleService } from '../services/roleService';

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: React.ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRoles = await roleService.getAllRoles();
      setRoles(fetchedRoles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData: RoleFormData) => {
    try {
      setLoading(true);
      setError(null);
      const newRole = await roleService.createRole(roleData);
      setRoles(prev => [...prev, newRole]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: string, roleData: Partial<RoleFormData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRole = await roleService.updateRole(id, roleData);
      setRoles(prev => prev.map(role => role.id === id ? updatedRole : role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await roleService.deleteRole(id);
      setRoles(prev => prev.filter(role => role.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPermissionToRole = async (roleId: string, permissionId: string) => {
    try {
      setError(null);
      await roleService.addPermissionToRole(roleId, permissionId);
      await fetchRoles(); // Refresh roles to get updated permissions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add permission to role');
      throw err;
    }
  };

  const removePermissionFromRole = async (roleId: string, permissionId: string) => {
    try {
      setError(null);
      await roleService.removePermissionFromRole(roleId, permissionId);
      await fetchRoles(); // Refresh roles to get updated permissions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove permission from role');
      throw err;
    }
  };

  const createBulkRoles = async (rolesData: BulkRoleData[]) => {
    try {
      setLoading(true);
      setError(null);
      const newRoles = await roleService.createBulkRoles(rolesData);
      setRoles(prev => [...prev, ...newRoles]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bulk roles');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const value: RoleContextType = {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    addPermissionToRole,
    removePermissionFromRole,
    createBulkRoles,
    fetchRoles,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};