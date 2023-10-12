import { Injectable } from '@angular/core';
import { Modules } from '../constants/modules';
import { PermissionAccess } from '../constants/permission-access';

@Injectable({ providedIn: 'root' })
export class ModulesService {
  public readonly moduleNames: Record<
    Modules,
    {
      id: Modules;
      singular: string;
      plural: string;
    }
  > = {
    [Modules.CUSTOMERS]: {
      id: Modules.CUSTOMERS,
      plural: 'Customers',
      singular: 'Customer',
    },
    [Modules.ORDERS]: {
      id: Modules.ORDERS,
      plural: 'Orders',
      singular: 'Order',
    },
    [Modules.PERMISSIONS]: {
      id: Modules.PERMISSIONS,
      plural: 'Permissions',
      singular: 'Permission',
    },
  };

  public readonly moduleNamesArray = Object.values(this.moduleNames);

  public readonly moduleAccesses: Record<
    PermissionAccess,
    {
      id: PermissionAccess;
      name: string;
    }
  > = {
    [PermissionAccess.ACCESS_OWN]: {
      id: PermissionAccess.ACCESS_OWN,
      name: 'Own',
    },
    [PermissionAccess.ACCESS_NONE]: {
      id: PermissionAccess.ACCESS_NONE,
      name: 'None',
    },
    [PermissionAccess.ACCESS_ALL]: {
      id: PermissionAccess.ACCESS_ALL,
      name: 'All',
    },
  };

  public readonly moduleAccessesArray = Object.values(this.moduleAccesses);
}
