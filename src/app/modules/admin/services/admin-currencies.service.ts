import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Injectable } from '@angular/core';
import { AdminModules } from '../../../constants/modules';
import { AdminCurrencies, AdminCurrenciesResponse } from '../types/currencies';

@Injectable()
export class AdminCurrenciesService extends BaseModuleService<
  AdminCurrenciesResponse,
  AdminCurrencies
> {
  toDto = (item: AdminCurrenciesResponse): AdminCurrencies => {
    return item;
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, AdminModules.CURRENCIES);
    this.read({}).subscribe();
  }

  moduleFieldNames = {};
  moduleItemName = 'Currency';
  moduleName = 'Currencies';
}
