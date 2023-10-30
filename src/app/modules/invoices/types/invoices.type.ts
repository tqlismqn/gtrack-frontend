import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';
import { Order } from '../../orders/types/orders.type';
import { Customer, CustomerBank } from '../../customers/types/customers.type';

export interface InvoiceResponse extends ModuleBaseResponse {
  order_id?: string;
  order?: Order;
  vat_id: string;
  contact_phone: string;
  contact_email: string;
  accounting_email: string;
  customer_id?: string;
  customer?: Customer;
  first_loading_date: string;
  last_uploading_date: string;
  pick_order_date: string;
  invoice_issued_date: string;
  terms_of_payment: string;
  currency: string;
  course: number;
  remark: string;
  bank?: CustomerBank;
  items?: InvoiceItem[];
}

export interface Invoice extends ModuleBase {
  order_id?: string;
  order?: Order;
  vat_id: string;
  contact_phone: string;
  contact_email: string;
  accounting_email: string;
  customer_id?: string;
  customer?: Customer;
  first_loading_date: string;
  last_uploading_date: string;
  pick_order_date: string;
  invoice_issued_date: string;
  terms_of_payment: string;
  currency: string;
  course: number;
  remark: string;
  bank?: CustomerBank;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price_per_item: number;
  price_vat: number;
  price: number;
}

export type CustomerFields = Pick<
  Customer,
  | 'vat_id'
  | 'contact_phone'
  | 'contact_email'
  | 'accounting_email'
  | 'internal_company_id'
  | 'terms_of_payment'
>;

export type OrderFields = Pick<
  Order,
  'customer' | 'first_loading_date' | 'last_uploading_date' | 'created_at'
>;
