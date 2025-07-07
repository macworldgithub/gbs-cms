import { Role, RoleFormData, BulkRoleData } from '../types';

class RoleService {
  private roles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: [
        {
          id: '1',
          name: 'users.create',
          description: 'Create new users',
          resource: 'users',
          action: 'create',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'users.read',
          description: 'View user information',
          resource: 'users',
          action: 'read',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '3',
          name: 'users.update',
          description: 'Update user information',
          resource: 'users',
          action: 'update',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '4',
          name: 'users.delete',
          description: 'Delete users',
          resource: 'users',
          action: 'delete',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '5',
          name: 'events.manage',
          description: 'Full event management',
          resource: 'events',
          action: 'manage',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '6',
          name: 'chats.moderate',
          description: 'Moderate chat conversations',
          resource: 'chats',
          action: 'moderate',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '7',
          name: 'roles.manage',
          description: 'Manage roles and permissions',
          resource: 'roles',
          action: 'manage',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Event Manager',
      description: 'Manage events and related content',
      permissions: [
        {
          id: '2',
          name: 'users.read',
          description: 'View user information',
          resource: 'users',
          action: 'read',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '5',
          name: 'events.manage',
          description: 'Full event management',
          resource: 'events',
          action: 'manage',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'User',
      description: 'Basic user with limited permissions',
      permissions: [
        {
          id: '2',
          name: 'users.read',
          description: 'View user information',
          resource: 'users',
          action: 'read',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '8',
          name: 'events.read',
          description: 'View events',
          resource: 'events',
          action: 'read',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '9',
          name: 'chats.participate',
          description: 'Participate in chats',
          resource: 'chats',
          action: 'participate',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  // GET /roles - Get all roles
  async getAllRoles(): Promise<Role[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.roles.filter(role => role.isActive);
  }

  // GET /roles/{id} - Get a role by ID
  async getRoleById(id: string): Promise<Role | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.roles.find(role => role.id === id) || null;
  }

  // POST /roles - Create a new role
  async createRole(roleData: RoleFormData): Promise<Role> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleData.name,
      description: roleData.description,
      permissions: [], // Will be populated when permissions are added
      isActive: roleData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.roles.push(newRole);
    return newRole;
  }

  // PUT /roles/{id} - Update a role
  async updateRole(id: string, roleData: Partial<RoleFormData>): Promise<Role> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.roles.findIndex(role => role.id === id);
    if (index === -1) {
      throw new Error('Role not found');
    }

    this.roles[index] = {
      ...this.roles[index],
      ...roleData,
      updatedAt: new Date(),
    };

    return this.roles[index];
  }

  // DELETE /roles/{id} - Delete a role
  async deleteRole(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.roles.findIndex(role => role.id === id);
    if (index === -1) {
      throw new Error('Role not found');
    }

    this.roles[index].isActive = false;
    this.roles[index].updatedAt = new Date();
  }

  // POST /roles/bulk - Create multiple roles with permission names
  async createBulkRoles(rolesData: BulkRoleData[]): Promise<Role[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRoles: Role[] = [];
    
    for (const roleData of rolesData) {
      const newRole: Role = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: roleData.name,
        description: roleData.description,
        permissions: [], // Will be populated based on permission names
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      this.roles.push(newRole);
      newRoles.push(newRole);
    }

    return newRoles;
  }

  // POST /roles/{id}/permissions - Add a permission to a role by name or ID
  async addPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Check if permission already exists in role
    const hasPermission = role.permissions.some(p => p.id === permissionId);
    if (hasPermission) {
      throw new Error('Permission already exists in role');
    }

    // In a real implementation, you would fetch the permission from permissionService
    // For now, we'll create a mock permission
    const mockPermission = {
      id: permissionId,
      name: `permission.${permissionId}`,
      description: `Permission ${permissionId}`,
      resource: 'mock',
      action: 'mock',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    role.permissions.push(mockPermission);
    role.updatedAt = new Date();
  }

  // DELETE /roles/{id}/permissions/{permission} - Remove a permission from a role
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    role.permissions = role.permissions.filter(p => p.id !== permissionId);
    role.updatedAt = new Date();
  }

  // PUT /roles/{roleId}/permissions/{permissionId} - Add or update a permission in a role
  async updateRolePermission(roleId: string, permissionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const existingPermissionIndex = role.permissions.findIndex(p => p.id === permissionId);
    
    if (existingPermissionIndex >= 0) {
      // Update existing permission
      role.permissions[existingPermissionIndex].updatedAt = new Date();
    } else {
      // Add new permission
      await this.addPermissionToRole(roleId, permissionId);
    }
    
    role.updatedAt = new Date();
  }
}

export const roleService = new RoleService();