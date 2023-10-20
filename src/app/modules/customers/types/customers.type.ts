import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';

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
  street: string;
  remark: string;
  documents: CustomerDocument[];
  terms_of_payment: string;
  pallet_balance: number;
  raiting: CustomerRaiting[];
  insurance_credit_limit: number;
  available_insurance_limit: number;
  internal_credit_limit: number;
  total_available_credit_limit: number;
  banks: CustomerBank[];
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
  street: string;
  remark: string;
  documents: CustomerDocument[];
  terms_of_payment: string;
  pallet_balance: number;
  raiting: CustomerRaiting[];
  insurance_credit_limit: number;
  available_insurance_limit: number;
  internal_credit_limit: number;
  total_available_credit_limit: number;
  banks: CustomerBank[];
}

export type CustomerDocument = {
  name: string;
  lastModified: number;
  id?: string;
  file?: File;
};
export type CustomerRaiting = {
  raiting: 'red' | 'yellow' | 'green';
};
export type CustomerBank = {
  bank_template: {
    name: string;
    id: string;
    bic: string;
  };

  currency: string;
  name: string;
  code: string;
  iban: string;
  bic: string;
};
