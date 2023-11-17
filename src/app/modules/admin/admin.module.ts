import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersTableComponent } from './components/users/admin-users-table/admin-users-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatTableModule } from '@angular/material/table';
import { AdminUsersEditComponent } from './components/users/admin-users-edit/admin-users-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AdminCompaniesEditComponent } from './components/companies/admin-companies-edit/admin-companies-edit.component';
import { AdminCompaniesTableComponent } from './components/companies/admin-companies-table/admin-companies-table.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { BankCollectionTableComponent } from './components/bank-collection/bank-collection-table/bank-collection-table.component';
import { BankCollectionEditComponent } from './components/bank-collection/bank-collection-edit/bank-collection-edit.component';
import { AdminBankCollectionService } from './services/admin-bank-collection.service';
import { AdminCompaniesService } from './services/admin-companies.service';
import { AdminUsersService } from './services/admin-users.service';
import { CurrenciesTableComponent } from './components/currencies/currencies-table/currencies-table.component';
import { CurrenciesEditComponent } from './components/currencies/currencies-edit/currencies-edit.component';

@NgModule({
  declarations: [
    AdminUsersTableComponent,
    AdminUsersEditComponent,
    AdminCompaniesEditComponent,
    AdminCompaniesTableComponent,
    BankCollectionTableComponent,
    BankCollectionEditComponent,
    CurrenciesTableComponent,
    CurrenciesEditComponent,
  ],
  imports: [
    CommonModule,
    BaseModuleModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    RouterLink,
  ],
  providers: [
    AdminBankCollectionService,
    AdminCompaniesService,
    AdminUsersService,
  ],
})
export class AdminModule {}
