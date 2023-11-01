import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';
import {
  Customer,
  CustomerResponse,
} from '../../customers/types/customers.type';

export interface OrderResponse extends ModuleBaseResponse {
  customer_id: string;
  customer?: CustomerResponse;
  currency: string;
  order_price: number;
  internal_order_id: number;
  first_loading_date: string;
  last_uploading_date: string;
  disponent_id: string;
  delivery_responsible_id: string;
  loading_points_info: OrderLoadingPoints[];
}

export interface Order extends ModuleBase {
  customer_id: string;
  customer?: Customer;
  currency: string;
  order_price: number;
  internal_order_id: number;
  first_loading_date: string;
  last_uploading_date: string;
  disponent_id: string;
  delivery_responsible_id: string;
  loading_points_info: OrderLoadingPoints[];
}

export interface OrderLoadingPoints {
  point: string;
}
