import { UserResponse } from '../../auth/types/user';
import { Nameable } from '../../base-module/types/nameable.type';

export type SuperAdminUserResponse = UserResponse & {
  company_names: Nameable[];
};
export type SuperAdminUser = SuperAdminUserResponse;
