import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import { AdminModules } from '../../../../../constants/modules';
import { AdminUser, AdminUserResponse } from '../../../types/users';
import {
  BankCollection,
  BankCollectionResponse,
} from '../../../types/bank-collection';

@Component({
  selector: 'app-bank-collection-table',
  templateUrl: './bank-collection-table.component.html',
  styleUrls: ['./bank-collection-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankCollectionTableComponent {
  @ViewChild('appTable') appTable!: TableComponent<
    BankCollectionResponse,
    BankCollection
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
      name: 'BIC / SWIFT',
      value: 'bic',
    },
    {
      name: 'Code',
      value: 'code',
    },
    {
      name: 'Address',
      value: 'address',
    },
    {
      name: 'City',
      value: 'city',
    },
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
      name: 'BIC / SWIFT',
      value: 'bic',
    },
    {
      name: 'Code',
      value: 'code',
    },
    {
      name: 'Address',
      value: 'address',
    },
    {
      name: 'City',
      value: 'city',
    },
  ];

  module = AdminModules.BANK_COLLECTIONS;

  displayedColumns: string[] = [
    'name',
    'bic',
    'code',
    'address',
    'city',
    'actions',
  ];

  toDto(value: AdminUserResponse): AdminUser {
    return value;
  }
}
