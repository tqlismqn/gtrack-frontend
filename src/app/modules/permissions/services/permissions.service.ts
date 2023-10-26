import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import {
  PermissionModule,
  PermissionModuleResponse,
} from '../types/permissions.type';
import { Injectable } from '@angular/core';
import { Modules } from '../../../constants/modules';
import { PermissionsUtils } from '../utils/permissions-utils';

@Injectable()
export class PermissionsService extends BaseModuleService<
  PermissionModuleResponse,
  PermissionModule
> {
  constructor(deps: BaseModuleServiceDeps) {
    super(deps, Modules.PERMISSIONS);
  }

  toDto = PermissionsUtils.permissionResponseToDTO;
  moduleFieldNames = {};
  moduleItemName = 'Permission';
  moduleName = 'Permissions';
}
