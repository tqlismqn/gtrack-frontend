import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CustomersEditComponent } from './components/customers-edit/customers-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomersTableComponent } from './components/customers-table/customers-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';

@NgModule({
  declarations: [CustomersEditComponent, CustomersTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    BaseModuleModule,
  ],
})
export class CustomersModule {}
