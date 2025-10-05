import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

interface InvoiceRow {
  number: string;
  customer: string;
  amount: number;
  status: 'Оплачен' | 'Просрочен' | 'В работе';
}

@Component({
  selector: 'app-demo-invoices',
  standalone: true,
  imports: [CommonModule, NgClass, MatCardModule, MatTableModule, MatIconModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent {
  readonly displayedColumns = ['number', 'customer', 'amount', 'status'];
  readonly data: InvoiceRow[] = [
    { number: 'INV-2451', customer: 'TransLogix GmbH', amount: 42000, status: 'Оплачен' },
    { number: 'INV-2452', customer: 'Logis CZ', amount: 31500, status: 'В работе' },
    { number: 'INV-2453', customer: 'Nord Freight', amount: 19800, status: 'Просрочен' },
  ];

  getStatusIcon(status: InvoiceRow['status']): string {
    switch (status) {
      case 'Оплачен':
        return 'check_circle';
      case 'Просрочен':
        return 'error';
      default:
        return 'pending';
    }
  }
}
