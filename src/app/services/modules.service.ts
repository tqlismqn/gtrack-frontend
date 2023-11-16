import { Injectable } from '@angular/core';
import { AdminModules, Modules } from '../constants/modules';
import { PermissionAccess } from '../constants/permission-access';
import { Customer } from '../modules/customers/types/customers.type';
import { PermissionModule } from '../modules/permissions/types/permissions.type';
import { BankCollection } from '../modules/admin/types/bank-collection';
import { User } from '../modules/auth/types/user';
import { Company } from '../types/company.type';
import { Order } from '../modules/orders/types/orders.type';

@Injectable({ providedIn: 'root' })
export class ModulesService {
  public readonly moduleNames: Record<
    Modules,
    {
      id: Modules;
      singular: string;
      plural: string;
    }
  > = {
    [Modules.CUSTOMERS]: {
      id: Modules.CUSTOMERS,
      plural: 'Customers',
      singular: 'Customer',
    },
    [Modules.PERMISSIONS]: {
      id: Modules.PERMISSIONS,
      plural: 'Permissions',
      singular: 'Permission',
    },
    [Modules.ORDERS]: {
      id: Modules.ORDERS,
      plural: 'Orders',
      singular: 'Order',
    },
    [Modules.INVOICES]: {
      id: Modules.INVOICES,
      plural: 'Invoices',
      singular: 'Invoice',
    },
  };

  public readonly moduleNamesArray = Object.values(this.moduleNames);

  public readonly moduleAccesses: Record<
    PermissionAccess,
    {
      id: PermissionAccess;
      name: string;
    }
  > = {
    [PermissionAccess.ACCESS_OWN]: {
      id: PermissionAccess.ACCESS_OWN,
      name: 'Own',
    },
    [PermissionAccess.ACCESS_NONE]: {
      id: PermissionAccess.ACCESS_NONE,
      name: 'None',
    },
    [PermissionAccess.ACCESS_ALL]: {
      id: PermissionAccess.ACCESS_ALL,
      name: 'All',
    },
  };

  public readonly modulesFieldNames: {
    [Modules.CUSTOMERS]?: { [key in keyof Customer]?: string };
    [Modules.PERMISSIONS]?: { [key in keyof PermissionModule]?: string };
    [Modules.ORDERS]?: { [key in keyof Order]?: string };
    [Modules.INVOICES]?: { [key in keyof Order]?: string };
    [AdminModules.BANK_COLLECTIONS]?: {
      [key in keyof BankCollection]?: string;
    };
    [AdminModules.USERS]?: {
      [key in keyof User]?: string;
    };
    [AdminModules.COMPANIES]?: {
      [key in keyof Company]?: string;
    };
    [AdminModules.CURRENCIES]?: {
      [key in keyof Company]?: string;
    };
  } = {
    [Modules.CUSTOMERS]: {
      company_name: 'Company Name',
      vat_id: 'VAT ID no.',
      internal_company_id: 'Company ID',
      contact_name: 'Contact Person',
      contact_phone: 'Contact Phone',
      contact_email: 'Main contact Email',
      accounting_email: 'Email for accounting department',
      nation: 'Nation',
      zip: 'Zip Code',
      city: 'City',
      street: 'Street',
      remark: 'Remark',
      documents: 'Documents',
      terms_of_payment: 'Terms of Payment',
      pallet_balance: 'Pallet balance',
      raiting: 'Raiting',
      insurance_credit_limit: 'Insurance Credit Limit ',
      available_insurance_limit: 'Available Insurance  Limit',
      internal_credit_limit: 'Internal credit limit',
      total_available_credit_limit: 'Total Available Credit Limit',
      banks: 'Banking details',
      last_raiting: 'Raiting',
    },
  };

  public readonly moduleAccessesArray = Object.values(this.moduleAccesses);
}
