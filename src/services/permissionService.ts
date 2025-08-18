import axios from 'axios';
import { Permission, PermissionFormData, BulkPermissionData } from '../types';
import { VITE_API_BASE_URL as API_BASE_URL } from '../utils/config/server';

// const API_BASE_URL = "http://localhost:9000/";

class PermissionService {
  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await axios(url, config);
    return response.data;
  }

  // Create a single permission
  async createPermission(permissionData: PermissionFormData): Promise<Permission> {
    return this.request<Permission>('permissions', {
      method: 'POST',
      data: permissionData,
    });
  }

  // Create multiple permissions at once
  async createBulkPermissions(permissionsData: BulkPermissionData[]): Promise<Permission[]> {
    return this.request<Permission[]>('permissions/bulk', {
      method: 'POST',
      data: { permissions: permissionsData }, // match roleService structure
    });
  }

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.request<Permission[]>('permissions');
  }

  // Get a permission by ID
  async getPermissionById(id: string): Promise<Permission> {
    return this.request<Permission>(`permissions/${id}`);
  }

  // Update a permission
  async updatePermission(id: string, permissionData: Partial<PermissionFormData>): Promise<Permission> {
    return this.request<Permission>(`permissions/${id}`, {
      method: 'PUT',
      data: {
        name: permissionData.name,
        description: permissionData.description,
        resource: permissionData.resource,
        action: permissionData.action,
        isActive: permissionData.isActive,
      },
    });
  }

  // Delete a permission
  async deletePermission(id: string): Promise<void> {
    return this.request<void>(`permissions/${id}`, {
      method: 'DELETE',
    });
  }

  // Get permissions by resource
  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    return this.request<Permission[]>(`permissions?resource=${encodeURIComponent(resource)}`);
  }

  // Get permissions by action
  async getPermissionsByAction(action: string): Promise<Permission[]> {
    return this.request<Permission[]>(`permissions?action=${encodeURIComponent(action)}`);
  }
}

export const permissionService = new PermissionService();
