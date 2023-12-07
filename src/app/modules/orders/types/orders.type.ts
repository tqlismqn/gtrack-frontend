import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';
import {
  Customer,
  CustomerResponse,
} from '../../customers/types/customers.type';
import { Currencies } from '../../../types/currencies';
import { Nameable } from '../../base-module/types/nameable.type';

export interface OrderResponse extends ModuleBaseResponse {
  customer_id: string;
  customer?: CustomerResponse;
  currency: Currencies;
  order_price: number;
  internal_order_id: number;
  first_loading_date: string;
  last_uploading_date: string;
  disponent_id: string;
  delivery_responsible_id: string;
  loading_points_info: OrderLoadingPoints[];
  order_file?: OrderDocument;
  cmr_file?: OrderDocument;
  invoice_file?: OrderDocument;
  pallets_file?: OrderDocument;
  rate: number;
  status: OrderStatuses;
  truck_number?: string;
  trailer_number?: string;
  loading_address?: string;
  unloading_address?: string;
}

export interface Order extends ModuleBase {
  customer_id: string;
  customer?: Customer;
  currency: Currencies;
  order_price: number;
  internal_order_id: number;
  first_loading_date: string;
  last_uploading_date: string;
  disponent_id: string;
  delivery_responsible_id: string;
  loading_points_info: OrderLoadingPoints[];
  order_file?: OrderDocument;
  cmr_file?: OrderDocument;
  invoice_file?: OrderDocument;
  pallets_file?: OrderDocument;
  rate: number;
  status: OrderFrontendStatus;
  truck_number?: string;
  trailer_number?: string;
  loading_address?: string;
  unloading_address?: string;
}

export interface OrderFrontendStatus extends Nameable {
  id: OrderStatuses;
}

export enum OrderStatuses {
  DRAFT = 'draft',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  LOADED = 'loaded',
  UNLOADED = 'unloaded',
  READY_FOR_INVOICE = 'ready_for_invoice',
  INVOICE_SENT = 'invoice_sent',
  PAYMENT_RECEIVED = 'payment_received',
  PARTLY_PAID = 'partly_paid',
}

export const OrderStatusesNames: Record<OrderStatuses, string> = {
  [OrderStatuses.DRAFT]: 'Draft',
  [OrderStatuses.OPEN]: 'Open',
  [OrderStatuses.IN_PROGRESS]: 'In Progress',
  [OrderStatuses.LOADED]: 'Loaded',
  [OrderStatuses.UNLOADED]: 'Unloaded',
  [OrderStatuses.READY_FOR_INVOICE]: 'Ready For Invoice',
  [OrderStatuses.INVOICE_SENT]: 'Invoice Sent',
  [OrderStatuses.PAYMENT_RECEIVED]: 'Payment Received',
  [OrderStatuses.PARTLY_PAID]: 'Partly Paid',
};

export interface OrderLoadingPoints {
  point: string;
}

export interface OrderDocument {
  name: string;
  id: string;
}

export type OrderDocumentType =
  | 'order_file'
  | 'cmr_file'
  | 'invoice_file'
  | 'pallets_file';
