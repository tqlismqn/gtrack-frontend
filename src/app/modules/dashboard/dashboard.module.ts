import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, MatTableModule, MatInputModule]
})
export class DashboardModule {}
