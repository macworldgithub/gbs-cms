import { Role } from '../types/role';

const API_BASE_URL = 'http://localhost:9000/';

class RoleService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // GET /api/roles - Get all roles
  async findAll(): Promise<Role[]> {
    return this.request<Role[]>('roles');
  }

  // GET /api/roles/{id} - Get a role by ID
  async findOne(id: string): Promise<Role> {
    return this.request<Role>(`roles/${id}`);
  }

  // POST /api/roles - Create a new role
  async create(roleData: {
    name: string;
    label: string;
    permissions: Array<{
      permission: string;
      value: boolean | number;
    }>;
  }): Promise<Role> {
    return this.request<Role>('roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  // PUT /api/roles/{id} - Update a role
  async update(id: string, roleData: Partial<{
    name: string;
    label: string;
    permissions: Array<{
      permission: string;
      value: boolean | number;
    }>;
  }>): Promise<Role> {
    return this.request<Role>(`roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  // DELETE /api/roles/{id} - Delete a role
  async delete(id: string): Promise<void> {
    await this.request<void>(`roles/${id}`, {
      method: 'DELETE',
    });
  }

  // POST /api/roles/bulk - Create multiple roles
  async createBulk(rolesData: Array<{
    name: string;
    label: string;
    permissions: Array<{
      permission: string;
      value: boolean | number;
    }>;
  }>): Promise<Role[]> {
    return this.request<Role[]>('roles/bulk', {
      method: 'POST',
      body: JSON.stringify(rolesData),
    });
  }

  // POST /api/roles/{id}/permissions - Add a permission to a role
  async addPermissionToRole(roleId: string, permission: {
    permission: string;
    value: boolean | number;
  }): Promise<void> {
    await this.request<void>(`roles/${roleId}/permissions`, {
      method: 'POST',
      body: JSON.stringify(permission),
    });
  }

  // DELETE /api/roles/{id}/permissions/{permissionId} - Remove a permission from a role
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    await this.request<void>(`roles/${roleId}/permissions/${permissionId}`, {
      method: 'DELETE',
    });
  }

  // PUT /api/roles/{roleId}/permissions/{permissionId} - Update a permission in a role
  async updateRolePermission(roleId: string, permissionId: string, permission: {
    permission: string;
    value: boolean | number;
  }): Promise<void> {
    await this.request<void>(`roles/${roleId}/permissions/${permissionId}`, {
      method: 'PUT',
      body: JSON.stringify(permission),
    });
  }

  // Helper method to get role statistics
  async getStats(): Promise<{
    total: number;
    activeRoles: number;
    totalPermissions: number;
    averagePermissionsPerRole: number;
  }> {
    const roles = await this.findAll();
    const totalPermissions = roles.reduce((sum, role) => sum + role.permissions.length, 0);
    
    return {
      total: roles.length,
      activeRoles: roles.length, // Assuming all fetched roles are active
      totalPermissions,
      averagePermissionsPerRole: roles.length > 0 ? Math.round(totalPermissions / roles.length) : 0,
    };
  }

  // Helper method to search roles by name or label
  async searchRoles(query: string): Promise<Role[]> {
    const roles = await this.findAll();
    const searchTerm = query.toLowerCase();
    
    return roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm) ||
      role.label.toLowerCase().includes(searchTerm)
    );
  }

  // Helper method to get roles with specific permission
  async getRolesWithPermission(permissionId: string): Promise<Role[]> {
    const roles = await this.findAll();
    
    return roles.filter(role => 
      role.permissions.some(p => p.permission === permissionId)
    );
  }

  // Helper method to validate role data before creation/update
  validateRoleData(roleData: {
    name?: string;
    label?: string;
    permissions?: Array<{
      permission: string;
      value: boolean | number;
    }>;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (roleData.name !== undefined) {
      if (!roleData.name || roleData.name.trim().length === 0) {
        errors.push('Role name is required');
      }
      if (roleData.name && roleData.name.length > 50) {
        errors.push('Role name must be less than 50 characters');
      }
    }

    if (roleData.label !== undefined) {
      if (!roleData.label || roleData.label.trim().length === 0) {
        errors.push('Role label is required');
      }
      if (roleData.label && roleData.label.length > 100) {
        errors.push('Role label must be less than 100 characters');
      }
    }

    if (roleData.permissions !== undefined) {
      if (!Array.isArray(roleData.permissions)) {
        errors.push('Permissions must be an array');
      } else {
        roleData.permissions.forEach((permission, index) => {
          if (!permission.permission || typeof permission.permission !== 'string') {
            errors.push(`Permission ${index + 1}: permission ID is required and must be a string`);
          }
          if (permission.value === undefined || (typeof permission.value !== 'boolean' && typeof permission.value !== 'number')) {
            errors.push(`Permission ${index + 1}: value is required and must be a boolean or number`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const roleService = new RoleService();