import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Injectable } from '@angular/core';
import { AdminModules } from '../../../constants/modules';
import { AdminUser, AdminUserResponse } from '../types/users';

@Injectable()
export class AdminUsersService extends BaseModuleService<
  AdminUserResponse,
  AdminUser
> {
  toDto = (value: AdminUserResponse): AdminUser => {
    return value;
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, AdminModules.USERS);
  }

  moduleFieldNames = {};
  moduleItemName = 'User';
  moduleName = 'Users';
}
