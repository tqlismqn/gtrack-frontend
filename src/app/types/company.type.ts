import { PermissionAccess } from '../constants/permission-access';

export interface Company {
  id: string;
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
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
  access: {
    read_access: PermissionAccess;
    write_access: PermissionAccess;
  };
}
