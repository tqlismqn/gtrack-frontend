import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsTableComponent } from './components/permissions-table/permissions-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PermissionsCreateComponent } from './components/permissions-create/permissions-create.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [PermissionsTableComponent, PermissionsCreateComponent],
  imports: [CommonModule, BaseModuleModule, MatSortModule, MatTableModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink, ReactiveFormsModule, MatSelectModule],
})
export class PermissionsModule {}
