import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import {AdminModules, SuperAdminModules} from '../../../../../constants/modules';
import { AdminUser, AdminUserResponse } from '../../../types/users';
import { AdminCompany, AdminCompanyResponse } from '../../../types/companies';
import { AdminCompaniesService } from '../../../services/admin-companies.service';

@Component({
  selector: 'app-admin-companies-table',
  templateUrl: './admin-companies-table.component.html',
  styleUrls: ['./admin-companies-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCompaniesTableComponent {
  constructor(protected service: AdminCompaniesService) {}

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

  module = SuperAdminModules.COMPANIES;

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
