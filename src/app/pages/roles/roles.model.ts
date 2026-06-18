export interface Permission {
  id: string;
  code: string;
  module: string;
  action: string;
  description: string;
}

export interface RoleListItem {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isGlobal: boolean;
  editable: boolean;
  permissionsCount: number;
}

export interface RolePermission {
  permissionId: string;
  code: string;
  module: string;
  action: string;
  scope: Scope;
}

export interface RoleDetail extends Omit<RoleListItem, 'permissionsCount'> {
  permissions: RolePermission[];
}

export type Scope = 'own' | 'branch' | 'all';

export interface SaveRolePayload {
  name: string;
  description?: string;
  permissions: {
    permissionId: string;
    scope: Scope;
  }[];
}
