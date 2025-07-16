import React, { createContext, useContext, useState, useEffect } from 'react';
import { Permission, PermissionContextType, PermissionFormData, BulkPermissionData } from '../types';
import { permissionService } from '../services/permissionService';

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPermissions = await permissionService.getAllPermissions();
      setPermissions(fetchedPermissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  const createPermission = async (permissionData: PermissionFormData) => {
    try {
      setLoading(true);
      setError(null);
      const newPermission = await permissionService.createPermission(permissionData);
      setPermissions(prev => [...prev, newPermission]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create permission');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // const updatePermission = async (id: string, permissionData: Partial<PermissionFormData>) => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const updatedPermission = await permissionService.updatePermission(id, permissionData);
  //     setPermissions(prev => prev.map(permission => permission.id === id ? updatedPermission : permission));
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to update permission');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const updatePermission = async (id: string, permissionData: Partial<PermissionFormData>) => {
  try {
    setLoading(true);
    setError(null);
    const updatedPermission = await permissionService.updatePermission(id, permissionData);
    setPermissions(prev =>
      prev.map(permission =>
        (permission.id || permission._id) === id ? updatedPermission : permission
      )
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update permission');
    throw err;
  } finally {
    setLoading(false);
  }
};


  // const deletePermission = async (id: string) => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     await permissionService.deletePermission(id);
  //     setPermissions(prev => prev.filter(permission => permission.id !== id));
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to delete permission');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const deletePermission = async (id: string) => {
  try {
    setLoading(true);
    setError(null);
    await permissionService.deletePermission(id);
    setPermissions(prev =>
      prev.filter(permission => (permission.id || permission._id) !== id)
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete permission');
    throw err;
  } finally {
    setLoading(false);
  }
};



  const createBulkPermissions = async (permissionsData: BulkPermissionData[]) => {
    try {
      setLoading(true);
      setError(null);
      const newPermissions = await permissionService.createBulkPermissions(permissionsData);
      setPermissions(prev => [...prev, ...newPermissions]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bulk permissions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const value: PermissionContextType = {
    permissions,
    loading,
    error,
    createPermission,
    updatePermission,
    deletePermission,
    createBulkPermissions,
    fetchPermissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};