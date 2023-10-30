import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesService } from './services/invoices.service';
import { InvoicesTableComponent } from './components/invoices-table/invoices-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatTableModule } from '@angular/material/table';
import { InvoicesEditComponent } from './components/invoices-edit/invoices-edit.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CustomersModule } from "../customers/customers.module";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [InvoicesTableComponent, InvoicesEditComponent],
  imports: [CommonModule, BaseModuleModule, MatTableModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule, CustomersModule, MatButtonModule],
  providers: [InvoicesService],
})
export class InvoicesModule {}
