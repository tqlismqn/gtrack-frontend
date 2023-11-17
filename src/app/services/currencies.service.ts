import { Injectable } from '@angular/core';
import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../modules/base-module/services/base-module-service';
import {
  AdminCurrencies,
  AdminCurrenciesResponse,
  Currencies,
} from '../types/currencies';
import { Modules } from '../constants/modules';

@Injectable({ providedIn: 'root' })
export class CurrenciesService extends BaseModuleService<
  AdminCurrenciesResponse,
  AdminCurrencies
> {
  moduleFieldNames = {};
  moduleItemName = 'Currency';
  moduleName = 'Currencies';

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, Modules.CURRENCIES);
    this.read({}).subscribe();
  }

  toDto = (item: AdminCurrenciesResponse) => {
    return item;
  };

  public getRate(currency: Currencies): number {
    return this.data.find((item) => item.id === currency)?.rate ?? 1;
  }

  public fromEur(
    to: Currencies,
    value: number,
    rate: number | undefined = undefined,
  ): number {
    if (!rate) {
      rate = this.getRate(to);
    }

    return Math.round(value * rate * 100) / 100;
  }

  public toEur(
    from: Currencies,
    value: number,
    rate: number | undefined = undefined,
  ): number {
    if (!rate) {
      rate = this.getRate(from);
    }

    return Math.round((value / rate) * 100) / 100;
  }

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
