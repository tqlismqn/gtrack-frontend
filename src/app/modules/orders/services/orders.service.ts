import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Modules } from '../../../constants/modules';
import { Injectable } from '@angular/core';
import { Order, OrderResponse } from '../types/orders.type';
import { CustomersService } from '../../customers/services/customers.service';

@Injectable()
export class OrdersService extends BaseModuleService<OrderResponse, Order> {
  toDto = (item: OrderResponse): Order => {
    const customer = item.customer;
    return {
      ...item,
      customer: customer ? this.customersService.toDto(customer) : undefined,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    };
  };

  constructor(
    deps: BaseModuleServiceDeps,
    protected customersService: CustomersService,
  ) {
    super(deps, Modules.ORDERS);
  }

  moduleFieldNames = {};
  moduleItemName = 'Order';
  moduleName = 'Orders';
}
