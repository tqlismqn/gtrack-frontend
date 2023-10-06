import { AccessType } from './access.type';

export interface Company {
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  access: {
    read_access: AccessType;
    write_access: AccessType;
  };
}

export interface CompanyResponse {
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  access: {
    read_access: AccessType;
    write_access: AccessType;
  };
}
