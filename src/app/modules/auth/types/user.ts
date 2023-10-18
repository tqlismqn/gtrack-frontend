import { Roles } from '../../admin/types/roles';

export interface UserResponse {
  id: string;
  auth0_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active: boolean;
  role_id: Roles;
}

export type User = UserResponse;
