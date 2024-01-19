import { NgModule } from '@angular/core';
import { AdminCompaniesService } from './services/admin-companies.service';
import { AdminCompaniesTableComponent } from './components/companies/admin-companies-table/admin-companies-table.component';
import { AdminCompaniesEditComponent } from './components/companies/admin-companies-edit/admin-companies-edit.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BankCollectionTableComponent } from './components/bank-collection/bank-collection-table/bank-collection-table.component';
import { BankCollectionEditComponent } from './components/bank-collection/bank-collection-edit/bank-collection-edit.component';
import { SuperAdminUsersService } from './services/super-admin-users.service';
import { MatTableModule } from '@angular/material/table';
import { SuperAdminUsersEditComponent } from './components/users/super-admin-users-edit/super-admin-users-edit.component';
import { SuperAdminUsersTableComponent } from './components/users/super-admin-users-table/super-admin-users-table.component';

@NgModule({
  declarations: [
    AdminCompaniesTableComponent,
    AdminCompaniesEditComponent,
    BankCollectionTableComponent,
    BankCollectionEditComponent,
    SuperAdminUsersEditComponent,
    SuperAdminUsersTableComponent,
  ],
  imports: [
    CommonModule,
    BaseModuleModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
    MatButtonModule,
    MatTableModule,
  ],
  providers: [AdminCompaniesService, SuperAdminUsersService],
})
export class SuperAdminModule {}
