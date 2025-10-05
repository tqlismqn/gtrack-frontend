import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Modules } from '../../../../constants/modules';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { Selectable } from '../../../../types/selectable.type';
import { Order, OrderResponse } from '../../types/orders.type';
import { OrdersService } from '../../services/orders.service';

@Component({
  standalone: false,
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
    'created_date',
    'delivery_date',
    'order_price',
    'price_eur',
    'status',
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
    {
      name: 'Price EUR',
      value: 'price_eur',
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
      value: 'first_loading_date',
    },
    {
      name: 'Delivery Date',
      value: 'last_uploading_date',
    },
    {
      name: 'Order Price',
      value: 'order_price',
    },
    {
      name: 'Price EUR',
      value: 'price_eur',
    },
  ];
}
