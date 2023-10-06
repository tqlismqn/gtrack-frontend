export interface UserResponse {
  auth0_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active: boolean;
}

export type User = UserResponse;
