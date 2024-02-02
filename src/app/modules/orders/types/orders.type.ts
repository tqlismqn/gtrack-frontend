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
  cargo_type?: string;
  pallets?: string;
  loading_type?: OrderLoadingType[];
  trailer_type?: string;
  change_status?: string;
  change_status_file?: OrderDocument;
  cmr?: string;
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
  cargo_type?: string;
  pallets?: string;
  loading_type?: OrderLoadingType[];
  trailer_type?: string;
  change_status?: string;
  change_status_file?: OrderDocument;
  cmr?: string;
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
  type: LoadingPointsType;
  nation: string;
  zip_code: string;
  city: string;
  address: string;
  company_name: string;
  date: string;
  trailer_type: LoadingPointsTrailerType;
  adr: boolean;
  pallets: boolean;
  temperature: boolean;
  temperature_value: number;
  weight: string;
  comments: string;
}

export enum LoadingPointsType {
  Loading = 'Loading',
  Unloading = 'Unloading',
}

export enum LoadingPointsTrailerType {
  Standard = 'Standard',
  Mega = 'Mega',
  Frigo = 'Frigo',
  VAN = 'VAN',
  Other = 'Other',
}

export const LoadingPointsStatus: { [key: string]: boolean } = {
  YES: true,
  NO: false,
};

export enum OrderLoadingType {
  fixig_belts = 'Fixing belts',
  cover = 'Cover',
  uncover = 'Uncover',
  load_with_crane = 'Load with crane',
}

export const LoadingPointsTypeArray = Object.values(LoadingPointsType);
export const LoadingPointsTrailerTypeArray = Object.values(
  LoadingPointsTrailerType,
);

export const LoadingPointsStatusArray = Object.keys(LoadingPointsStatus);

export const OrderLoadingTypeArray = Object.values(OrderLoadingType);
export interface OrderDocument {
  name: string;
  id: string;
}

export type OrderDocumentType =
  | 'order_file'
  | 'cmr_file'
  | 'invoice_file'
  | 'pallets_file'
  | 'change_status_file';
