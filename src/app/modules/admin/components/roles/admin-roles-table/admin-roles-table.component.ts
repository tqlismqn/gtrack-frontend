import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import { AdminModules } from '../../../../../constants/modules';
import { AdminUser, AdminUserResponse } from '../../../types/users';
import { Role, RoleResponse, Roles } from '../../../types/roles';
import { AdminRolesService } from '../../../services/admin-roles.service';

@Component({
  selector: 'app-admin-roles-table',
  templateUrl: './admin-roles-table.component.html',
  styleUrls: ['./admin-roles-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRolesTableComponent {
  constructor(protected service: AdminRolesService) {}

  @ViewChild('appTable') appTable!: TableComponent<RoleResponse, Role>;

  sortableColumns: Selectable[] = [
    {
      name: 'Default',
      value: '',
    },
    {
      name: 'User',
      value: 'user_id',
    },
    {
      name: 'Role',
      value: 'role_id',
    },
  ];

  module = AdminModules.ROLES;

  displayedColumns: string[] = ['user_id', 'role', 'role_edit'];

  toEdit(item: Role) {
    this.appTable.openUpdatePage(item);
  }

  toDto(value: AdminUserResponse): AdminUser {
    return value;
  }

  getRoleName(value: Roles): string {
    switch (value) {
      case Roles.Admin:
        return 'Admin';
      case Roles.SuperAdmin:
        return 'Super Admin';
      case Roles.User:
        return 'User';
    }
  }
}
