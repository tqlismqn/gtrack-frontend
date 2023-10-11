import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { Modules } from '../../../../constants/modules';
import {
  PermissionModule,
  PermissionModuleResponse,
} from '../../types/permissions.type';
import { ModulesService } from '../../../../services/modules.service';

@Component({
  selector: 'app-permissions-table',
  templateUrl: './permissions-table.component.html',
  styleUrls: ['./permissions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsTableComponent {
  constructor(protected moduleService: ModulesService) {}
  @ViewChild('appTable') appTable!: TableComponent<
    PermissionModuleResponse,
    PermissionModule
  >;

  module = Modules.PERMISSIONS;

  displayedColumns: string[] = [
    'id',
    'module',
    'user',
    'read_access',
    'write_access',
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
}
