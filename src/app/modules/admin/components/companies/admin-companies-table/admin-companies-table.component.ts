import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ModulesService } from '../../../../../services/modules.service';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import { AdminModules } from '../../../../../constants/modules';
import { AdminUser, AdminUserResponse } from '../../../types/users';
import { AdminCompany, AdminCompanyResponse } from '../../../types/companies';

@Component({
  selector: 'app-admin-companies-table',
  templateUrl: './admin-companies-table.component.html',
  styleUrls: ['./admin-companies-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCompaniesTableComponent {
  constructor(protected moduleService: ModulesService) {}

  @ViewChild('appTable') appTable!: TableComponent<
    AdminCompanyResponse,
    AdminCompany
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
      name: 'Name',
      value: 'name',
    },
    {
      name: 'Employees Number',
      value: 'employees_number',
    },
    {
      name: 'Website',
      value: 'website',
    },
    {
      name: 'Owner',
      value: 'owner_id',
    },
  ];

  module = AdminModules.COMPANIES;

  displayedColumns: string[] = [
    'id',
    'name',
    'employees_number',
    'website',
    'owner_id',
    'actions',
  ];

  toDto(value: AdminUserResponse): AdminUser {
    return value;
  }
}
