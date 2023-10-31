import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Modules } from '../../../../constants/modules';
import { TableComponent } from '../../../base-module/components/table/table.component';
import { Selectable } from '../../../../types/selectable.type';
import { Invoice, InvoiceResponse } from '../../types/invoices.type';
import { InvoicesService } from '../../services/invoices.service';

@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesTableComponent {
  @ViewChild('appTable') appTable!: TableComponent<InvoiceResponse, Invoice>;

  constructor(protected service: InvoicesService) {}

  module = Modules.CUSTOMERS;

  displayedColumns: string[] = ['invoice_id', 'actions'];
  searchableColumns: Selectable[] = [
    {
      name: 'Invoice ID',
      value: 'internal_invoice_id',
    },
  ];
  sortableColumns: Selectable[] = [
    {
      name: 'Invoice ID',
      value: 'internal_invoice_id',
    },
  ];
}
