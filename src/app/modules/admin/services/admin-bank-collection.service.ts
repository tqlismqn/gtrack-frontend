import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Injectable } from '@angular/core';
import {
  BankCollection,
  BankCollectionResponse,
} from '../types/bank-collection';
import { AdminModules } from '../../../constants/modules';

@Injectable()
export class AdminBankCollectionService extends BaseModuleService<
  BankCollectionResponse,
  BankCollection
> {
  toDto = (item: BankCollectionResponse): BankCollection => {
    return item;
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, AdminModules.BANK_COLLECTIONS);
    this.read({}).subscribe();
  }

  moduleFieldNames = {};
  moduleItemName = 'Bank';
  moduleName = 'Banks';
}
