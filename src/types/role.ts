export interface Role {
  _id: string;
  name: string;
  label: string;
  permissions: Array<{
    _id?: string; 
    permission: {
      _id: string;
      name: string;
      label: string;
    };
    value: boolean | number;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RoleFormData {
  name: string;
  description: string; 
  permissionIds: string[];
}

export interface BulkRoleData {
  name: string;
  description?:string;
  label?: string; 
  permissionNames: string[];
}


export interface RoleContextType {
  roles: Role[];
  loading: boolean;
  error: string | null;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  fetchRoles: () => void;
  createRole: (data: RoleFormData) => Promise<void>;
  updateRole: (id: string, data: Partial<RoleFormData>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  addPermissionToRole: (roleId: string, permissionId: string) => Promise<void>;
  removePermissionFromRole: (roleId: string, permissionId: string) => Promise<void>;
  createBulkRoles: (data: BulkRoleData[]) => Promise<void>;
  getRoleById: (id: string) => Promise<Role>; 
}
