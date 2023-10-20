import { Nameable } from './nameable.type';
import { SortType } from './soring.type';
import { SearchType } from './search.type';
import { PaginationType } from './pagination.type';

export interface ModuleBaseReadRequest {
  company_id?: string;
  sort?: SortType;
  search?: SearchType;
  pagination?: PaginationType;
}

export interface ModuleBaseResponse {
  id: string;
  owned_by_id: number;
  created_by_id: number;
  updated_by_id: number;
  created_at: string;
  updated_at: string;
  owned_by: Nameable;
  created_by: Nameable;
  updated_by: Nameable;
}

export interface ModuleBase {
  id: string;
  owned_by_id: number;
  created_by_id: number;
  updated_by_id: number;
  created_at: Date;
  updated_at: Date;
  owned_by: Nameable;
  created_by: Nameable;
  updated_by: Nameable;
}
