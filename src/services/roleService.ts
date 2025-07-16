import axios from 'axios';
import { Role, RoleFormData } from '../types';

const API_BASE_URL = "http://localhost:9000/";

class RoleService {
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

  async createRole(roleData: RoleFormData): Promise<Role> {
    return this.request<Role>('roles', {
      method: 'POST',
      data: {
        name: roleData.name,
        label: roleData.description,
      },
    });
  }

  async createBulkRoles(rolesData: {
    name: string;
    label: string;
    permissions: { name: string; value: boolean }[];
  }[]): Promise<Role[]> {
    return this.request<Role[]>('roles/bulk', {
      method: 'POST',
      data: { roles: rolesData },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.request<Role[]>('roles');
  }

  // ✅ Alias to avoid "findAll is not a function" error
  async findAll(): Promise<Role[]> {
    return this.getAllRoles();
  }

  async deleteRole(id: string): Promise<void> {
    return this.request<void>(`roles/${id}`, {
      method: 'DELETE',
    });
  }

  async updateRole(id: string, roleData: Partial<RoleFormData>): Promise<Role> {
    return this.request<Role>(`roles/${id}`, {
      method: 'PUT',
      data: {
        name: roleData.name,
        label: roleData.description,
        permissionIds: roleData.permissionIds,
        isActive: roleData.isActive,
      },
    });
  }

  async getRoleById(id: string): Promise<Role> {
    return this.request<Role>(`roles/${id}`);
  }

  async addPermissionToRole(roleId: string, permissionNameOrId: string): Promise<void> {
    return this.request<void>(`roles/${roleId}/permissions`, {
      method: 'POST',
      data: {
        permission: permissionNameOrId,
      },
    });
  }

  async removePermissionFromRole(roleId: string, permissionIdOrName: string): Promise<void> {
    return this.request<void>(`roles/${roleId}/permissions/${permissionIdOrName}`, {
      method: 'DELETE',
    });
  }

  async updatePermissionOfRole(roleId: string, permissionId: string, value: boolean = true): Promise<void> {
    return this.request<void>(`roles/${roleId}/permissions/${permissionId}`, {
      method: 'PUT',
      data: { value },
    });
  }
}

export const roleService = new RoleService();
