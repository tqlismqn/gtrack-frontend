import { PermissionAccess } from '../constants/permission-access';

export interface Company {
  id: number;
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
  id: number;
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  access: {
    read_access: PermissionAccess;
    write_access: PermissionAccess;
  };
}
