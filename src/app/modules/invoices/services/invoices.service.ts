import {
  BaseModuleService,
  BaseModuleServiceDeps,
} from '../../base-module/services/base-module-service';
import { Modules } from '../../../constants/modules';
import { EventEmitter, Injectable, signal } from '@angular/core';
import { Invoice, InvoiceItem, InvoiceResponse } from '../types/invoices.type';
import { Order } from '../../orders/types/orders.type';
import { OrdersService } from '../../orders/services/orders.service';
import { merge, Observable } from 'rxjs';
import { CustomersService } from '../../customers/services/customers.service';
import { Customer } from '../../customers/types/customers.type';
import { environment } from '../../../../environments/environment';

@Injectable()
export class InvoicesService extends BaseModuleService<
  InvoiceResponse,
  Invoice
> {
  toDto = (value: InvoiceResponse): Invoice => {
    return {
      ...value,
      created_at: new Date(value.created_at),
      updated_at: new Date(value.updated_at),
    };
  };

  constructor(
    deps: BaseModuleServiceDeps,
    protected ordersService: OrdersService,
    protected customersService: CustomersService,
  ) {
    super(deps, Modules.INVOICES);
    this.initOrders();
    this.initCustomers();
  }

  orders = signal<Order[]>([]);

  protected initOrders() {
    this.readOrders();
    merge(
      this.ordersService.created$,
      this.ordersService.updated$,
      this.ordersService.deleted$,
    ).subscribe(() => {
      this.readOrders();
    });
  }

  public readOrders() {
    this.ordersService.read({}, false).subscribe(([data]) => {
      this.orders.set(data);
    });
  }

  customers: Customer[] = [];
  customers$ = new EventEmitter<Customer[]>();

  protected initCustomers() {
    this.readCustomers();
    merge(
      this.customersService.created$,
      this.customersService.updated$,
      this.customersService.deleted$,
    ).subscribe(() => {
      this.readCustomers();
    });
  }

  protected readCustomers() {
    this.customersService.read({}, false).subscribe(([data]) => {
      this.customers = data;
      this.customers$.emit(data);
    });
  }

  public addItem(
    id: string,
    item: Pick<InvoiceItem, 'description' | 'quantity' | 'price_per_item'>,
  ) {
    return new Observable<InvoiceItem>((subscriber) => {
      this.deps.http
        .post(
          `${environment.apiUrl}/api/v1/${this.module}/add-item/${id}?company_id=${this.companyId}`,
          {
            description: item.description,
            quantity: item.quantity,
            price_per_item: item.price_per_item,
          },
        )
        .subscribe({
          next: (response) => {
            const item = response as InvoiceItem;
            subscriber.next(item);
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  moduleFieldNames = {};
  moduleItemName = 'Invoice';
  moduleName = 'Invoices';
}
