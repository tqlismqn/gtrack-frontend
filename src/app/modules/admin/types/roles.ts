import { ModuleBaseResponse } from '../../base-module/types/module-base.type';

export enum Roles {
  User = 'user',
  SuperAdmin = 'super_admin',
  Admin = 'admin',
}

export interface RoleResponse extends ModuleBaseResponse {
  role: Roles;
  user_id: string;
}
export type Role = RoleResponse;
