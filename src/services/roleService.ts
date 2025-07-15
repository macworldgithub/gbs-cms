import axios from 'axios';
import { Role, RoleFormData, BulkRoleData } from '../types';

const baseUrl = import.meta.env.VITE_API_URL ?? '';

if (!baseUrl) {
  throw new Error('Base URL not set. Check your .env.local file.');
}

class RoleService {
  async createRole(roleData: RoleFormData): Promise<Role> {
    const response = await axios.post(`${baseUrl}/roles`, {
      name: roleData.name,
      label: roleData.description,
    });

    return response.data as Role;
  }

// roleService.ts
async createBulkRoles(rolesData: {
  name: string;
  label: string;
  permissions: { name: string; value: boolean }[];
}[]): Promise<Role[]> {
  const response = await axios.post(`${baseUrl}/roles/bulk`, {
    roles: rolesData,
  });

  return response.data as Role[];
}


  async getAllRoles(): Promise<Role[]> {
    const response = await axios.get(`${baseUrl}/roles`);
    return response.data as Role[];
  }

  async deleteRole(id: string): Promise<void> {
    await axios.delete(`${baseUrl}/roles/${id}`);
  }

  async updateRole(id: string, roleData: Partial<RoleFormData>): Promise<Role> {
    const response = await axios.put(`${baseUrl}/roles/${id}`, {
      name: roleData.name,
      label: roleData.description,
      permissionIds: roleData.permissionIds,
      isActive: roleData.isActive,
    });

    return response.data as Role;
  }

  async getRoleById(id: string): Promise<Role> {
    const response = await axios.get(`${baseUrl}/roles/${id}`);
    return response.data as Role;
  }

  async addPermissionToRole(roleId: string, permissionNameOrId: string): Promise<void> {
    await axios.post(`${baseUrl}/roles/${roleId}/permissions`, {
      permission: permissionNameOrId,
    });
  }

  async removePermissionFromRole(roleId: string, permissionIdOrName: string): Promise<void> {
    await axios.delete(`${baseUrl}/roles/${roleId}/permissions/${permissionIdOrName}`);
  }

  async updatePermissionOfRole(roleId: string, permissionId: string, value: boolean = true): Promise<void> {
    await axios.put(`${baseUrl}/roles/${roleId}/permissions/${permissionId}`, {
      value,
    });
  }



}

export const roleService = new RoleService();



