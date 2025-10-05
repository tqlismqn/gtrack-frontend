import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Modules } from '../../../../constants/modules';
import { Customer, CustomerResponse } from '../../types/customers.type';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { CustomersUtils } from '../../utils/customers-utils';
import { Selectable } from '../../../../types/selectable.type';
import { CustomersEditComponent } from '../customers-edit/customers-edit.component';
import { CustomersService } from '../../services/customers.service';

@Component({
  standalone: false,
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersTableComponent {
  @ViewChild('appTable') appTable!: TableComponent<CustomerResponse, Customer>;

  constructor(protected service: CustomersService) {}

  module = Modules.CUSTOMERS;

  displayedColumns: string[] = [
    'internal_company_id',
    'company_name',
    'vat_id',
    'nation',
    'zip_code',
    'city',
    'street',
    'invoices',
    'open_invoices',
    'internal_credit_limit',
    'total_available_credit_limit',
    'pallet_balance',
    'claims',
    'last_raiting',
    'actions',
  ];
  searchableColumns: Selectable[] = [
    {
      name: 'ID',
      value: 'internal_company_id',
    },
    {
      name: 'Name',
      value: 'company_name',
    },
    {
      name: 'VAT Number',
      value: 'vat_id',
    },
  ];
  sortableColumns: Selectable[] = [
    {
      name: 'ID',
      value: 'internal_company_id',
    },
    {
      name: 'Name',
      value: 'company_name',
    },
    {
      name: 'VAT Number',
      value: 'vat_id',
    },
    {
      name: 'Limit',
      value: 'internal_credit_limit',
    },
    {
      name: 'Available Limit',
      value: 'total_available_credit_limit',
    },
    {
      name: 'Raiting',
      value: 'last_raiting',
    },
  ];
  customerResponseToDTO = CustomersUtils.customerResponseToDTO;
  getRaitingClassName = CustomersEditComponent._getRaitingClassName;
}
