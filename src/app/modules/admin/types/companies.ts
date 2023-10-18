import { Nameable } from '../../base-module/types/nameable.type';

export type AdminCompanyResponse = {
  id: string;
  name: string;
  employees_number: string;
  website: string;
  owner_name?: Nameable;
  user_names?: Nameable[];
};
export type AdminCompany = AdminCompanyResponse;
