import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesService } from './services/invoices.service';
import { InvoicesTableComponent } from './components/invoices-table/invoices-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatTableModule } from '@angular/material/table';
import { InvoicesEditComponent } from './components/invoices-edit/invoices-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CustomersModule } from '../customers/customers.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvoicesOrdersTableComponent } from './components/invoices-orders-table/invoices-orders-table.component';
import { InvoicesOrdersService } from './services/invoices-orders.service';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";

@NgModule({
  declarations: [
    InvoicesTableComponent,
    InvoicesEditComponent,
    InvoicesOrdersTableComponent,
  ],
  imports: [
    CommonModule,
    BaseModuleModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    CustomersModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  providers: [InvoicesService, InvoicesOrdersService],
})
export class InvoicesModule {}
