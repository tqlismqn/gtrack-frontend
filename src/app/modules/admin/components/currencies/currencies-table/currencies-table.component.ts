import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import { AdminModules } from '../../../../../constants/modules';
import {
  AdminCurrencies,
  AdminCurrenciesResponse,
} from '../../../types/currencies';
import { AdminCurrenciesService } from '../../../services/admin-currencies.service';

@Component({
  selector: 'app-currencies-table',
  templateUrl: './currencies-table.component.html',
  styleUrls: ['./currencies-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesTableComponent {
  @ViewChild('appTable') appTable!: TableComponent<
    AdminCurrenciesResponse,
    AdminCurrencies
  >;

  constructor(protected service: AdminCurrenciesService) {}

  sortableColumns: Selectable[] = [
    {
      name: 'Default',
      value: '',
    },
    {
      name: 'Name',
      value: 'id',
    },
    {
      name: 'Rate',
      value: 'rate',
    },
  ];

  searchableColumns: Selectable[] = [
    {
      name: 'Name',
      value: 'id',
    },
  ];

  module = AdminModules.CURRENCIES;

  displayedColumns: string[] = ['name', 'rate', 'edit'];
}
