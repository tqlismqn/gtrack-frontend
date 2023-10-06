import { AccessType } from './access.type';

export interface Company {
  id: number;
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
  id: number;
  name: string;
  employees_number: string;
  website: string;
  owner: boolean;
  access: {
    read_access: AccessType;
    write_access: AccessType;
  };
}
