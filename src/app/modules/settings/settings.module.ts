import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { BaseModuleModule } from "../base-module/base-module.module";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  declarations: [SettingsFormComponent],
  imports: [CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatSelectModule, MatTabsModule, BaseModuleModule, MatTableModule]
})
export class SettingsModule {}
