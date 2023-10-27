import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Modules } from '../../../constants/modules';
import { Injectable } from '@angular/core';
import { Order, OrderResponse } from '../types/orders.type';

@Injectable()
export class OrdersService extends BaseModuleService<OrderResponse, Order> {
  toDto = (item: OrderResponse): Order => {
    return {
      ...item,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    };
  };

  constructor(deps: BaseModuleServiceDeps) {
    super(deps, Modules.ORDERS);
  }

  moduleFieldNames = {};
  moduleItemName = 'Order';
  moduleName = 'Orders';
}
