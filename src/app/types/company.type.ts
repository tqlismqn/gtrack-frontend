import { PermissionAccess } from '../constants/permission-access';
import { Currencies } from './currencies';
import { Roles } from '../modules/admin/types/roles';

export interface Company {
  id: string;
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  currencies: Currencies[];
  conditions_terms: string | null;
  access: {
    read_access: PermissionAccess;
    write_access: PermissionAccess;
  };
  role: Roles;
}

export interface CompanyResponse {
  id: string;
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  currencies: Currencies[];
  conditions_terms: string | null;
  access: {
    read_access: PermissionAccess;
    write_access: PermissionAccess;
  };
  role: Roles;
}
