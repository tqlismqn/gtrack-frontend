import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';
import { Order } from '../../orders/types/orders.type';
import { Customer, CustomerBank } from '../../customers/types/customers.type';
import { TermsOfPaymentEnum } from '../../customers/types/terms-of-payment.enum';

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
  terms_of_payment: TermsOfPaymentEnum;
  currency: string;
  course: number;
  remark: string;
  bank?: CustomerBank[];
  items?: InvoiceItem[];
  internal_invoice_id: number;
  paid_sum: number | null;
  discount?: InvoiceDiscount;
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
  terms_of_payment: TermsOfPaymentEnum;
  currency: string;
  course: number;
  remark: string;
  bank?: CustomerBank[];
  items?: InvoiceItem[];
  internal_invoice_id: number;
  paid_sum: number | null;
  discount?: InvoiceDiscount;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price_per_item: number;
  price_vat: number;
  price: number;
}

export interface InvoiceDiscount {
  type_of_discount: string;
  discount: number;
}

export type CustomerFields = Pick<
  Customer,
  | 'vat_id'
  | 'contact_phone'
  | 'contact_email'
  | 'accounting_email'
  | 'internal_company_id'
  | 'terms_of_payment'
  | 'banks'
>;

export type OrderFields = Pick<
  Order,
  | 'id'
  | 'customer'
  | 'first_loading_date'
  | 'last_uploading_date'
  | 'created_at'
  | 'status'
  | 'order_price'
  | 'currency'
>;
