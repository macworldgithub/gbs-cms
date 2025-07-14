import axios from 'axios';
import { Role, RoleFormData } from '../types';

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





// POST /roles/bulk - Create multiple roles with permission names
// async createBulkRoles(rolesData: BulkRoleData[]): Promise<Role[]> {
//   await new Promise(resolve => setTimeout(resolve, 500));

//   const newRoles: Role[] = [];

//   for (const roleData of rolesData) {
//     const newRole: Role = {
//       id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       name: roleData.name,
//       description: roleData.description,
//       permissions: [], // Will be populated based on permission names
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     this.roles.push(newRole);
//     newRoles.push(newRole);
//   }

//   return newRoles;
// }

// POST /roles/{id}/permissions - Add a permission to a role by name or ID
// async addPermissionToRole(roleId: string, permissionId: string): Promise<void> {
//   await new Promise(resolve => setTimeout(resolve, 200));

//   const role = this.roles.find(r => r.id === roleId);
//   if (!role) {
//     throw new Error('Role not found');
//   }

//   // Check if permission already exists in role
//   const hasPermission = role.permissions.some(p => p.id === permissionId);
//   if (hasPermission) {
//     throw new Error('Permission already exists in role');
//   }

//   // In a real implementation, you would fetch the permission from permissionService
//   // For now, we'll create a mock permission
//   const mockPermission = {
//     id: permissionId,
//     name: `permission.${permissionId}`,
//     description: `Permission ${permissionId}`,
//     resource: 'mock',
//     action: 'mock',
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   role.permissions.push(mockPermission);
//   role.updatedAt = new Date();
// }

// DELETE /roles/{id}/permissions/{permission} - Remove a permission from a role
// async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
//   await new Promise(resolve => setTimeout(resolve, 200));

//   const role = this.roles.find(r => r.id === roleId);
//   if (!role) {
//     throw new Error('Role not found');
//   }

//   role.permissions = role.permissions.filter(p => p.id !== permissionId);
//   role.updatedAt = new Date();
// }

// PUT /roles/{roleId}/permissions/{permissionId} - Add or update a permission in a role
// async updateRolePermission(roleId: string, permissionId: string): Promise<void> {
//   await new Promise(resolve => setTimeout(resolve, 200));

//   const role = this.roles.find(r => r.id === roleId);
//   if (!role) {
//     throw new Error('Role not found');
//   }

//   const existingPermissionIndex = role.permissions.findIndex(p => p.id === permissionId);

//   if (existingPermissionIndex >= 0) {
//     // Update existing permission
//     role.permissions[existingPermissionIndex].updatedAt = new Date();
//   } else {
//     // Add new permission
//     await this.addPermissionToRole(roleId, permissionId);
//   }

//   role.updatedAt = new Date();
// }

