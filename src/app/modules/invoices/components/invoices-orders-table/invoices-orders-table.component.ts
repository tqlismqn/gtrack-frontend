import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Modules } from '../../../../constants/modules';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { Selectable } from '../../../../types/selectable.type';
import { Order, OrderResponse } from '../../../orders/types/orders.type';
import { InvoicesOrdersService } from '../../services/invoices-orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoices-orders-table',
  templateUrl: './invoices-orders-table.component.html',
  styleUrls: ['./invoices-orders-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesOrdersTableComponent {
  @ViewChild('appTable') appTable!: TableComponent<OrderResponse, Order>;

  constructor(
    protected service: InvoicesOrdersService,
    protected router: Router,
  ) {}

  module = Modules.ORDERS;

  displayedColumns: string[] = [
    'internal_order_id',
    'customer',
    'created_by',
    'created_at',
    'delivery_date',
    'order_price',
    'create_from_order',
  ];
  searchableColumns: Selectable[] = [
    {
      name: 'Order ID',
      value: 'internal_order_id',
    },
    {
      name: 'Customer',
      value: 'customer',
    },
    {
      name: 'Order Price',
      value: 'order_price',
    },
  ];
  sortableColumns: Selectable[] = [
    {
      name: 'Order ID',
      value: 'internal_order_id',
    },
    {
      name: 'Customer',
      value: 'customer',
    },
    {
      name: 'Created By',
      value: 'created_by',
    },
    {
      name: 'Creation Date',
      value: 'created_at',
    },
    {
      name: 'Order Price',
      value: 'order_price',
    },
  ];

  createFromOrder(item: Order) {
    this.router.navigateByUrl(`/${Modules.INVOICES}/create`, {
      state: {
        order: item,
      },
    });
  }
}
