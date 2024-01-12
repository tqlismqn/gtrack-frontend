import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { BankCollectionService } from '../../services/bank-collection.service';
import { AdminUsersService } from './services/admin-users.service';
import { AdminRolesService } from './services/admin-roles.service';
import { AdminRolesTableComponent } from './components/roles/admin-roles-table/admin-roles-table.component';
import { AdminRolesEditComponent } from './components/roles/admin-roles-edit/admin-roles-edit.component';
import { AdminUsersEditComponent } from './components/admin-users/admin-users-edit/admin-users-edit.component';
import { AdminUsersTableComponent } from './components/admin-users/admin-users-table/admin-users-table.component';

@NgModule({
  declarations: [
    AdminRolesTableComponent,
    AdminRolesEditComponent,
    AdminUsersEditComponent,
    AdminUsersTableComponent,
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
  providers: [BankCollectionService, AdminUsersService, AdminRolesService],
})
export class AdminModule {}
