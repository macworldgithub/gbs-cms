import axios from 'axios';
import { Permission, PermissionFormData, BulkPermissionData } from '../types';

const baseUrl = import.meta.env.VITE_API_URL ?? '';

if (!baseUrl) {
  throw new Error('Base URL not set. Check your .env.local file.');
}

class PermissionService {
  // GET /permissions - Get all permissions from API
  async getAllPermissions(): Promise<Permission[]> {
    const response = await axios.get(`${baseUrl}/permissions`);
    return response.data as Permission[];
  }

  // GET /permissions/{id} - Get a permission by ID
  async getPermissionById(id: string): Promise<Permission | null> {
    const response = await axios.get(`${baseUrl}/permissions/${id}`);
    return response.data as Permission;
  }

  // POST /permissions - Create a new permission
  async createPermission(permissionData: PermissionFormData): Promise<Permission> {
    const response = await axios.post(`${baseUrl}/permissions`, permissionData);
    return response.data as Permission;
  }

  // PUT /permissions/{id} - Update a permission
  async updatePermission(id: string, permissionData: Partial<PermissionFormData>): Promise<Permission> {
    const response = await axios.put(`${baseUrl}/permissions/${id}`, permissionData);
    return response.data as Permission;
  }

  // DELETE /permissions/{id} - Delete a permission
  async deletePermission(id: string): Promise<void> {
    await axios.delete(`${baseUrl}/permissions/${id}`);
  }

  // POST /permissions/bulk - Create multiple permissions at once
  async createBulkPermissions(permissionsData: BulkPermissionData[]): Promise<Permission[]> {
    const response = await axios.post(`${baseUrl}/permissions/bulk`, permissionsData);
    return response.data as Permission[];
  }

  // Helper method to get permissions by resource
  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    const response = await axios.get(`${baseUrl}/permissions?resource=${encodeURIComponent(resource)}`);
    return response.data as Permission[];
  }

  // Helper method to get permissions by action
  async getPermissionsByAction(action: string): Promise<Permission[]> {
    const response = await axios.get(`${baseUrl}/permissions?action=${encodeURIComponent(action)}`);
    return response.data as Permission[];
  }
}

export const permissionService = new PermissionService();