import {
  ModuleBase,
  ModuleBaseResponse,
} from '../../base-module/types/module-base.type';

export interface CustomerResponse extends ModuleBaseResponse {
  id: string;
  name: string;
}

export interface Customer extends ModuleBase {
  id: string;
  name: string;
}
