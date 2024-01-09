import { PermissionAccess } from '../constants/permission-access';
import { Currencies } from './currencies';

export interface Company {
  id: string;
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  currencies: Currencies[];
  access: {
    read_access: PermissionAccess;
    write_access: PermissionAccess;
  };
}

export interface CompanyResponse {
  id: string;
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  currencies: Currencies[];
  access: {
    read_access: PermissionAccess;
    write_access: PermissionAccess;
  };
}
