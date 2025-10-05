import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

interface ContactRow {
  name: string;
  role: string;
  phone: string;
  email: string;
  tags: string[];
}

@Component({
  selector: 'app-demo-address-book',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule],
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss'],
})
export class AddressBookComponent {
  readonly displayedColumns = ['name', 'role', 'phone', 'email', 'tags'];
  readonly data: ContactRow[] = [
    {
      name: 'Kateřina Malá',
      role: 'Dispatcher',
      phone: '+420 605 111 222',
      email: 'katerina.mala@example.com',
      tags: ['Morning', 'Praha'],
    },
    {
      name: 'David Čech',
      role: 'Fleet Manager',
      phone: '+420 602 987 654',
      email: 'david.cech@example.com',
      tags: ['Fleet', 'Drivers'],
    },
    {
      name: 'Markéta Tomášová',
      role: 'Accountant',
      phone: '+420 731 223 447',
      email: 'marketa.tomasova@example.com',
      tags: ['Invoices'],
    },
  ];
}
