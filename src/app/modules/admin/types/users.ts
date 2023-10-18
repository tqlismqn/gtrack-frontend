import { UserResponse } from '../../auth/types/user';
import { Nameable } from '../../base-module/types/nameable.type';

export type AdminUserResponse = UserResponse & {
  company_names: Nameable[];
};
export type AdminUser = AdminUserResponse;
