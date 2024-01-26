import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from './services/orders.service';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { BaseModuleModule } from '../base-module/base-module.module';
import { MatTableModule } from '@angular/material/table';
import { OrdersCreateComponent } from './components/orders-create/orders-create.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { OrdersUpdateComponent } from './components/orders-update/orders-update.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    OrdersTableComponent,
    OrdersCreateComponent,
    OrdersUpdateComponent,
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    BaseModuleModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule
  ],
  providers: [OrdersService],
})
export class OrdersModule {}
