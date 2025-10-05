import { Component, effect, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DriversFiltersComponent } from './filters/filters.component';
import { DriversSummaryComponent } from './summary/summary.component';
import { DriversTableComponent } from './table/table.component';
import { DriversIconsComponent } from './icons/icons.component';
import { DriversDrawerComponent } from './drawer/drawer.component';
import { DriversStore } from './drivers.store';
import { Driver, DriverFilters, DriversSummary } from '../../shared/models';
import { DemoSearchService } from '../../shared/search.service';
import { DRIVERS_DATA } from '../../shared/data.port';
import { LocalDriversDataService } from './drivers.data.local';

@Component({
  selector: 'app-drivers-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    DriversFiltersComponent,
    DriversSummaryComponent,
    DriversTableComponent,
    DriversIconsComponent,
    DriversDrawerComponent,
  ],
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
  providers: [DriversStore, { provide: DRIVERS_DATA, useClass: LocalDriversDataService }],
})
export class DriversPage {
  private readonly store = inject(DriversStore);
  private readonly search = inject(DemoSearchService);

  readonly filters: Signal<DriverFilters> = this.store.filters;
  readonly summary: Signal<DriversSummary> = this.store.summary;
  readonly drivers: Signal<Driver[]> = this.store.filtered;
  readonly selectedDriver = this.store.selectedDriver;
  readonly selectedIds = this.store.selectedIds;
  readonly loading = this.store.loadingState;

  adding = false;

  constructor() {
    effect(() => {
      this.store.setQuery(this.search.term());
    });
  }

  onFiltersChange(filters: Partial<DriverFilters>): void {
    this.store.setFilters(filters);
  }

  onResetFilters(): void {
    this.store.resetFilters();
  }

  onSelectDriver(id: string): void {
    this.adding = false;
    this.store.select(id);
  }

  onToggleSelection(event: { id: string; selected: boolean }): void {
    this.store.toggleSelection(event.id, event.selected);
  }

  onToggleAll(selected: boolean): void {
    const ids = this.drivers().map((driver) => driver.id);
    this.store.setAllSelected(ids, selected);
  }

  async onRemoveSelected(): Promise<void> {
    await this.store.removeMany(this.selectedIds());
  }

  async onActivateSelected(): Promise<void> {
    await this.store.activateMany(this.selectedIds());
  }

  addDriver(): void {
    this.adding = true;
    this.store.select(null);
  }

  async onSave(driver: Driver): Promise<void> {
    await this.store.add(driver);
    this.adding = false;
  }

  async seedDemo(): Promise<void> {
    await this.store.reseed();
  }

  async resetDemo(): Promise<void> {
    await this.store.reset();
  }

  async addRandom(): Promise<void> {
    await this.store.addRandom();
  }

  async shiftDocs(): Promise<void> {
    const driver = this.selectedDriver();
    if (!driver) {
      return;
    }
    await this.store.shiftDocs(driver.id, 30);
  }

  closeDrawer(): void {
    this.adding = false;
    this.store.select(null);
  }
}
