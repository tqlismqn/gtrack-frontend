import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';

export interface CustomerResponse extends ModuleBaseResponse {
  id: number;
  name: string;
}

export interface Customer extends ModuleBase {
  id: number;
  name: string;
}
