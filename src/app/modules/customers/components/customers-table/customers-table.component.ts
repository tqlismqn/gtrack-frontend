import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Modules } from '../../../../constants/modules';
import { Customer, CustomerResponse } from '../../types/customers.type';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { CustomersUtils } from '../../utils/customers-utils';

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
    'id',
    'name',
    'created_by',
    'created_at',
    'updated_by',
    'updated_at',
    'owned_by',
    'actions',
  ];
  customerResponseToDTO = CustomersUtils.customerResponseToDTO;
}
