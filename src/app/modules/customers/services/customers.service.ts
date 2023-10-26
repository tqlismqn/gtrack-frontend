import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Customer, CustomerResponse } from '../types/customers.type';
import { Modules } from '../../../constants/modules';
import { Injectable } from '@angular/core';
import { CustomersUtils } from '../utils/customers-utils';

@Injectable()
export class CustomersService extends BaseModuleService<
  CustomerResponse,
  Customer
> {
  toDto = CustomersUtils.customerResponseToDTO;

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, Modules.CUSTOMERS);
  }

  moduleFieldNames = {};
  moduleItemName = 'Customer';
  moduleName = 'Customers';
}
