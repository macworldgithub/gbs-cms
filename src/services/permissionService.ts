import { Permission, PermissionFormData, BulkPermissionData } from '../types';

class PermissionService {
  private permissions: Permission[] = [
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
    {
      id: '10',
      name: 'events.create',
      description: 'Create new events',
      resource: 'events',
      action: 'create',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '11',
      name: 'events.update',
      description: 'Update events',
      resource: 'events',
      action: 'update',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '12',
      name: 'events.delete',
      description: 'Delete events',
      resource: 'events',
      action: 'delete',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  // GET /permissions - Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.permissions.filter(permission => permission.isActive);
  }

  // GET /permissions/{id} - Get a permission by ID
  async getPermissionById(id: string): Promise<Permission | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.permissions.find(permission => permission.id === id) || null;
  }

  // POST /permissions - Create a new permission
  async createPermission(permissionData: PermissionFormData): Promise<Permission> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newPermission: Permission = {
      id: Date.now().toString(),
      name: permissionData.name,
      description: permissionData.description,
      resource: permissionData.resource,
      action: permissionData.action,
      isActive: permissionData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.permissions.push(newPermission);
    return newPermission;
  }

  // PUT /permissions/{id} - Update a permission
  async updatePermission(id: string, permissionData: Partial<PermissionFormData>): Promise<Permission> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.permissions.findIndex(permission => permission.id === id);
    if (index === -1) {
      throw new Error('Permission not found');
    }

    this.permissions[index] = {
      ...this.permissions[index],
      ...permissionData,
      updatedAt: new Date(),
    };

    return this.permissions[index];
  }

  // DELETE /permissions/{id} - Delete a permission
  async deletePermission(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.permissions.findIndex(permission => permission.id === id);
    if (index === -1) {
      throw new Error('Permission not found');
    }

    this.permissions[index].isActive = false;
    this.permissions[index].updatedAt = new Date();
  }

  // POST /permissions/bulk - Create multiple permissions at once
  async createBulkPermissions(permissionsData: BulkPermissionData[]): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPermissions: Permission[] = [];
    
    for (const permissionData of permissionsData) {
      const newPermission: Permission = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: permissionData.name,
        description: permissionData.description,
        resource: permissionData.resource,
        action: permissionData.action,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      this.permissions.push(newPermission);
      newPermissions.push(newPermission);
    }

    return newPermissions;
  }

  // Helper method to get permissions by resource
  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.permissions.filter(permission => 
      permission.resource === resource && permission.isActive
    );
  }

  // Helper method to get permissions by action
  async getPermissionsByAction(action: string): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.permissions.filter(permission => 
      permission.action === action && permission.isActive
    );
  }
}

export const permissionService = new PermissionService();