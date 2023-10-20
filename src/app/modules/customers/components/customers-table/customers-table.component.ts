import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Modules } from '../../../../constants/modules';
import { Customer, CustomerResponse } from '../../types/customers.type';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { CustomersUtils } from '../../utils/customers-utils';
import { Selectable } from '../../../../types/selectable.type';

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersTableComponent {
  @ViewChild('appTable') appTable!: TableComponent<CustomerResponse, Customer>;

  module = Modules.CUSTOMERS;

  displayedColumns: string[] = [
    'internal_company_id',
    'company_name',
    'contact_email',
    'created_at',
    'updated_at',
    'actions',
  ];
  searchableColumns: Selectable[] = [
    {
      name: 'ID',
      value: 'id',
    },
    {
      name: 'Name',
      value: 'name',
    },
    {
      name: 'Created By',
      value: 'created_by',
    },
    {
      name: 'Updated By',
      value: 'updated_by',
    },
    {
      name: 'Owned By',
      value: 'owned_by',
    },
  ];
  customerResponseToDTO = CustomersUtils.customerResponseToDTO;
}
