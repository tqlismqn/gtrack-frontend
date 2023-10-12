import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EditComponentComponent } from './components/edit-component/edit-component.component';

@NgModule({
  declarations: [TableComponent, EditFormComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterLink,
    FormsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
  ],
  exports: [TableComponent, EditFormComponent],
})
export class BaseModuleModule {}
