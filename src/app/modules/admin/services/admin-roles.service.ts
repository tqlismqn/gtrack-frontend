import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Injectable } from '@angular/core';
import { AdminModules } from '../../../constants/modules';
import { Role, RoleResponse } from '../types/roles';

@Injectable()
export class AdminRolesService extends BaseModuleService<RoleResponse, Role> {
  toDto = (value: RoleResponse): Role => {
    return value;
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, AdminModules.ROLES);
  }

  moduleFieldNames = {};
  moduleItemName = 'Role';
  moduleName = 'Roles';
}
