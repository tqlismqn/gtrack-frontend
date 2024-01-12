import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../modules/base-module/services/base-module-service';
import { Injectable } from '@angular/core';
import {
  BankCollection,
  BankCollectionResponse,
} from '../modules/super-admin/types/bank-collection';
import { SuperAdminModules } from '../constants/modules';

@Injectable()
export class BankCollectionService extends BaseModuleService<
  BankCollectionResponse,
  BankCollection
> {
  toDto = (item: BankCollectionResponse): BankCollection => {
    return item;
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, SuperAdminModules.BANK_COLLECTIONS);
    this.read({}).subscribe();
  }

  moduleFieldNames = {};
  moduleItemName = 'Bank';
  moduleName = 'Banks';

  override sseInitModule() {
    this.deps.sse.echo
      .private(`${this.module}`)
      .listen('.App\\Events\\Model\\ModelUpdate', (data: { id: string }) => {
        this.processUpdate(data.id);
        this.updated$.emit(data.id);
      })
      .listen('.App\\Events\\Model\\ModelCreate', (data: { id: string }) => {
        this.processCreate(data.id);
        this.created$.emit(data.id);
      })
      .listen('.App\\Events\\Model\\ModelDelete', (data: { id: string }) => {
        this.processDelete(data.id);
        this.deleted$.emit(data.id);
      });
  }
}
