import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ModulesService } from '../../../../../services/modules.service';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import { AdminModules } from '../../../../../constants/modules';
import { AdminUser, AdminUserResponse } from '../../../types/users';
import { Roles } from '../../../types/roles';

@Component({
  selector: 'app-admin-users-table',
  templateUrl: './admin-users-table.component.html',
  styleUrls: ['./admin-users-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersTableComponent {
  constructor(protected moduleService: ModulesService) {}

  @ViewChild('appTable') appTable!: TableComponent<
    AdminUserResponse,
    AdminUser
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
      name: 'First Name',
      value: 'first_name',
    },
    {
      name: 'Last Name',
      value: 'last_name',
    },
    {
      name: 'Phone',
      value: 'phone',
    },
    {
      name: 'Role',
      value: 'role_id',
    },
  ];

  module = AdminModules.USERS;

  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'phone',
    'role_id',
    'actions',
  ];

  toDto(value: AdminUserResponse): AdminUser {
    return value;
  }

  getRoleName(value: Roles): string {
    switch (value) {
      case Roles.SuperAdmin:
        return 'Super Admin';
      case Roles.User:
        return 'User';
    }
  }
}
