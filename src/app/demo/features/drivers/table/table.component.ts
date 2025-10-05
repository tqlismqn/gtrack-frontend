import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Driver } from '../../../shared/models';
import { worstDocState } from '../../../shared/docs.util';

@Component({
  selector: 'app-drivers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class DriversTableComponent {
  @Input() drivers: Driver[] = [];
  @Input() selectedIds: string[] = [];
  @Output() selectDriver = new EventEmitter<string>();
  @Output() toggleSelection = new EventEmitter<{ id: string; selected: boolean }>();
  @Output() toggleSelectionAll = new EventEmitter<boolean>();
  @Output() removeSelected = new EventEmitter<void>();
  @Output() activateSelected = new EventEmitter<void>();

  readonly displayedColumns = ['select', 'name', 'status', 'citizenship', 'workplace', 'docs'];

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  docState(driver: Driver): string {
    return worstDocState(driver.docs);
  }

  trackById(_: number, item: Driver): string {
    return item.id;
  }

  toggleRow(event: any, driver: Driver): void {
    this.toggleSelection.emit({ id: driver.id, selected: event.checked });
  }

  toggleAll(event: any): void {
    this.toggleSelectionAll.emit(event.checked);
  }

  bulkRemove(): void {
    this.removeSelected.emit();
  }

  bulkActivate(): void {
    this.activateSelected.emit();
  }
}
