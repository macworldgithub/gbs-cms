import axios from 'axios';
import { Permission, PermissionFormData, BulkPermissionData } from '../types';

const API_BASE_URL = 'http://localhost:9000/';

class PermissionService {
  // GET /permissions - Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    const response = await axios.get(`${API_BASE_URL}permissions`);
    return response.data as Permission[];
  }

  // GET /permissions/{id} - Get a permission by ID
  async getPermissionById(id: string): Promise<Permission | null> {
    const response = await axios.get(`${API_BASE_URL}permissions/${id}`);
    return response.data as Permission;
  }

  // POST /permissions - Create a new permission
  async createPermission(permissionData: PermissionFormData): Promise<Permission> {
    const response = await axios.post(`${API_BASE_URL}permissions`, permissionData);
    return response.data as Permission;
  }

  // PUT /permissions/{id} - Update a permission
  async updatePermission(id: string, permissionData: Partial<PermissionFormData>): Promise<Permission> {
    const response = await axios.put(`${API_BASE_URL}permissions/${id}`, permissionData);
    return response.data as Permission;
  }

  // DELETE /permissions/{id} - Delete a permission
  async deletePermission(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}permissions/${id}`);
  }

  // POST /permissions/bulk - Create multiple permissions at once
  async createBulkPermissions(permissionsData: BulkPermissionData[]): Promise<Permission[]> {
    const response = await axios.post(`${API_BASE_URL}permissions/bulk`, permissionsData);
    return response.data as Permission[];
  }

  // GET /permissions?resource=xyz
  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    const response = await axios.get(`${API_BASE_URL}permissions?resource=${encodeURIComponent(resource)}`);
    return response.data as Permission[];
  }

  // GET /permissions?action=xyz
  async getPermissionsByAction(action: string): Promise<Permission[]> {
    const response = await axios.get(`${API_BASE_URL}permissions?action=${encodeURIComponent(action)}`);
    return response.data as Permission[];
  }
}

export const permissionService = new PermissionService();
