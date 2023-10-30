import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CustomersEditComponent } from './components/customers-edit/customers-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomersTableComponent } from './components/customers-table/customers-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CustomersBankCollectionComponent } from './components/customers-bank-collection/customers-bank-collection.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomersService } from './services/customers.service';

@NgModule({
  declarations: [
    CustomersEditComponent,
    CustomersTableComponent,
    CustomersBankCollectionComponent
  ],
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
    MatSelectModule,
    MatRippleModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    NgxMatSelectSearchModule
  ],
  providers: [CustomersService],
  exports: [
    CustomersBankCollectionComponent
  ]
})
export class CustomersModule {}
