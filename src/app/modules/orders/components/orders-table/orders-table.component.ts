import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Modules } from '../../../../constants/modules';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { Selectable } from '../../../../types/selectable.type';
import { Order, OrderResponse } from '../../types/orders.type';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-customers-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersTableComponent {
  @ViewChild('appTable') appTable!: TableComponent<OrderResponse, Order>;

  constructor(protected service: OrdersService) {}

  module = Modules.ORDERS;

  displayedColumns: string[] = [
    'internal_order_id',
    'customer',
    'created_by',
    'created_at',
    'delivery_date',
    'order_price',
    'actions',
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
}
