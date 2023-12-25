import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Injectable } from '@angular/core';
import { SuperAdminModules } from '../../../constants/modules';
import { SuperAdminUser, SuperAdminUserResponse } from '../types/users';

@Injectable()
export class SuperAdminUsersService extends BaseModuleService<
  SuperAdminUserResponse,
  SuperAdminUser
> {
  toDto = (value: SuperAdminUserResponse): SuperAdminUser => {
    return value;
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, SuperAdminModules.USERS);
  }

  moduleFieldNames = {};
  moduleItemName = 'User';
  moduleName = 'Users';
}
