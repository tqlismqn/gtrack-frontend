import { Modules } from '../constants/modules';
import { PermissionAccess } from '../constants/permission-access';

export type Permission = {
  module_id: Modules;
  user_id: number;
  company_id: number;
  read_access: PermissionAccess;
  write_access: PermissionAccess;
};

export type PermissionResponse = {
  module_id: Modules;
  user_id: number;
  company_id: number;
  read_access: PermissionAccess;
  write_access: PermissionAccess;
};
