import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';
import { Modules } from '../../../constants/modules';
import { Nameable } from '../../base-module/types/nameable.type';
import { PermissionAccess } from '../../../constants/permission-access';

export interface PermissionModuleResponse extends ModuleBaseResponse {
  id: string;
  module_id: Modules;
  user_id: number;
  user: Nameable;
  read_access: PermissionAccess;
  write_access: PermissionAccess;
}

export interface PermissionModule extends ModuleBase {
  id: string;
  module_id: Modules;
  user_id: number;
  user: Nameable;
  read_access: PermissionAccess;
  write_access: PermissionAccess;
}
