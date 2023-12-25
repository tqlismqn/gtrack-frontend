import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import { AdminModules } from '../../../../../constants/modules';
import { Roles } from '../../../../admin/types/roles';
import { SuperAdminUsersService } from '../../../services/super-admin-users.service';
import { SuperAdminUser, SuperAdminUserResponse } from '../../../types/users';

@Component({
  selector: 'app-admin-users-table',
  templateUrl: './super-admin-users-table.component.html',
  styleUrls: ['./super-admin-users-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperAdminUsersTableComponent {
  constructor(protected service: SuperAdminUsersService) {}

  @ViewChild('appTable') appTable!: TableComponent<
    SuperAdminUserResponse,
    SuperAdminUser
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

  toDto(value: SuperAdminUserResponse): SuperAdminUser {
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
