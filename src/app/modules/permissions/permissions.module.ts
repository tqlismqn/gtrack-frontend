import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsTableComponent } from './components/permissions-table/permissions-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PermissionsEditComponent } from './components/permissions-edit/permissions-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { PermissionsService } from './services/permissions.service';

@NgModule({
  declarations: [PermissionsTableComponent, PermissionsEditComponent],
  imports: [
    CommonModule,
    BaseModuleModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  providers: [PermissionsService],
})
export class PermissionsModule {}
