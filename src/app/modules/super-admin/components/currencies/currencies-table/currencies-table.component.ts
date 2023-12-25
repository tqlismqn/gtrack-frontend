import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../base-module/components/table/table.component';
import { Selectable } from '../../../../../types/selectable.type';
import { SuperAdminModules } from '../../../../../constants/modules';
import {
  AdminCurrencies,
  AdminCurrenciesResponse,
} from '../../../../../types/currencies';
import { CurrenciesService } from '../../../../../services/currencies.service';

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

  constructor(protected service: CurrenciesService) {}

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

  module = SuperAdminModules.CURRENCIES;

  displayedColumns: string[] = ['name', 'rate', 'edit'];
}
