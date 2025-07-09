import { Role, RoleFormData } from '../types';

class RoleService {

  async createRole(roleData: RoleFormData): Promise<Role> {
    const baseUrl = import.meta.env.VITE_API_URL ?? '';

    if (!baseUrl) {
      throw new Error('Base URL not set. Check your .env.local file.');
    }

    const response = await fetch(`${baseUrl}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: roleData.name,
        label: roleData.description
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create role');
    }

    const data = await response.json();
    return data as Role;
  }

  async getAllRoles(): Promise<Role[]> {
    const baseUrl = import.meta.env.VITE_API_URL ?? '';

    if (!baseUrl) {
      throw new Error('Base URL not set. Check your .env.local file.');
    }

    const response = await fetch(`${baseUrl}/roles`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch roles');
    }

    const data = await response.json();
    return data as Role[];
  }

  async deleteRole(id: string): Promise<void> {
    const baseUrl = import.meta.env.VITE_API_URL ?? '';
    if (!baseUrl) throw new Error('Base URL not set. Check your .env.local file.');

    const response = await fetch(`${baseUrl}/roles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete role');
    }
  }

  async updateRole(id: string, roleData: Partial<RoleFormData>): Promise<Role> {
    const baseUrl = import.meta.env.VITE_API_URL ?? '';
    if (!baseUrl) throw new Error('Base URL not set. Check your .env.local file.');

    const response = await fetch(`${baseUrl}/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: roleData.name,
        label: roleData.description, 
        permissionIds: roleData.permissionIds,
        isActive: roleData.isActive,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update role');
    }

    const data = await response.json();
    return data as Role;
  }


  async getRoleById(id: string): Promise<Role> {
  const baseUrl = import.meta.env.VITE_API_URL ?? '';
  if (!baseUrl) throw new Error('Base URL not set. Check your .env.local file.');

  const response = await fetch(`${baseUrl}/roles/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch role by ID');
  }

  const data = await response.json();
  return data as Role;
}

}

// PUT /roles/{id} - Update a role
// async updateRole(id: string, roleData: Partial<RoleFormData>): Promise<Role> {
//   await new Promise(resolve => setTimeout(resolve, 300));

//   const index = this.roles.findIndex(role => role.id === id);
//   if (index === -1) {
//     throw new Error('Role not found');
//   }

//   this.roles[index] = {
//     ...this.roles[index],
//     ...roleData,
//     updatedAt: new Date(),
//   };

//   return this.roles[index];
// }



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


export const roleService = new RoleService();