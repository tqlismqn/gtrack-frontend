import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Injectable } from '@angular/core';
import { SuperAdminModules } from '../../../constants/modules';
import { AdminCompany, AdminCompanyResponse } from '../types/companies';

@Injectable()
export class AdminCompaniesService extends BaseModuleService<
  AdminCompanyResponse,
  AdminCompany
> {
  toDto = (value: AdminCompanyResponse): AdminCompany => {
    return value;
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, SuperAdminModules.COMPANIES);
  }

  moduleFieldNames = {};
  moduleItemName = 'Company';
  moduleName = 'Companies';
}
