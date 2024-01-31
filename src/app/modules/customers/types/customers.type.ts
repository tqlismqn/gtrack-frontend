import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';
import { TermsOfPaymentEnum } from './terms-of-payment.enum';

export interface CustomerResponse extends ModuleBaseResponse {
  id: string;
  company_name: string;
  vat_id: string;
  internal_company_id: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  accounting_email: string;
  nation: string;
  zip: string;
  city: string;
  is_client: boolean;
  is_contractor: boolean;
  street: string;
  remark: string;
  documents: CustomerDocument[];
  terms_of_payment: TermsOfPaymentEnum;
  pallet_balance: number;
  raiting: CustomerRaiting[];
  insurance_credit_limit: number;
  available_insurance_limit: number;
  internal_credit_limit: number;
  total_available_credit_limit: number;
  banks: CustomerBank[];
  last_raiting: number;
}

export interface Customer extends ModuleBase {
  id: string;
  company_name: string;
  vat_id: string;
  internal_company_id: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  accounting_email: string;
  nation: string;
  zip: string;
  city: string;
  is_client: boolean;
  is_contractor: boolean;
  street: string;
  remark: string;
  documents: CustomerDocument[];
  terms_of_payment: TermsOfPaymentEnum;
  pallet_balance: number;
  raiting: CustomerRaiting[];
  insurance_credit_limit: number;
  available_insurance_limit: number;
  internal_credit_limit: number;
  total_available_credit_limit: number;
  banks: CustomerBank[];
  last_raiting: number;
}

export type CustomerDocument = {
  name: string;
  lastModified: number;
  id?: string;
  file?: File;
};

export enum CustomerRaitingType {
  RED,
  YELLOW,
  GREEN,
  BLACK,
}

export type CustomerRaiting = {
  raiting: CustomerRaitingType;
  user: string;
  comment: string;
  date: string;
};

export type CustomerBank = {
  bank_template: {
    name: string;
    id: string;
    bic: string;
    code: string;
    address: string;
    city: string;
  };

  currency: string;
  name: string;
  code: string;
  iban: string;
  bic: string;
};
