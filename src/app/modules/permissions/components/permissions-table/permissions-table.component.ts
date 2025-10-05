import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { Modules } from '../../../../constants/modules';
import {
  PermissionModule,
  PermissionModuleResponse,
} from '../../types/permissions.type';
import { ModulesService } from '../../../../services/modules.service';
import { PermissionAccess } from '../../../../constants/permission-access';
import { Selectable } from '../../../../types/selectable.type';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  standalone: false,
  selector: 'app-permissions-table',
  templateUrl: './permissions-table.component.html',
  styleUrls: ['./permissions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsTableComponent {
  constructor(
    protected moduleService: ModulesService,
    protected service: PermissionsService,
  ) {}
  @ViewChild('appTable') appTable!: TableComponent<
    PermissionModuleResponse,
    PermissionModule
  >;

  sortableColumns: Selectable[] = [
    {
      name: 'Default',
      value: '',
    },
    {
      name: 'ID',
      value: 'id',
    },
    {
      name: 'Module',
      value: 'module',
    },
    {
      name: 'User',
      value: 'user',
    },
    {
      name: 'Read',
      value: 'read_access',
    },
    {
      name: 'Write',
      value: 'write_access',
    },
  ];

  module = Modules.PERMISSIONS;

  displayedColumns: string[] = [
    'id',
    'module',
    'user',
    'read_access',
    'write_access',
    'actions',
  ];

  toDto(value: PermissionModuleResponse): PermissionModule {
    return {
      ...value,
      created_at: new Date(value.created_at),
      updated_at: new Date(value.updated_at),
    };
  }

  getModuleName(module: Modules) {
    return this.moduleService.moduleNames[module].singular;
  }

  getAccessName(access: PermissionAccess) {
    return this.moduleService.moduleAccesses[access].name;
  }
}
