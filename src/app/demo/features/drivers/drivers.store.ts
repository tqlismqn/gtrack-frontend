import { Inject, Injectable, Signal, computed, signal } from '@angular/core';
import { DRIVERS_DATA, DriversDataPort } from '../../shared/data.port';
import { Driver, DriverFilters, DriversSummary } from '../../shared/models';
import { daysToState, worstDocState } from '../../shared/docs.util';
import { randomDriver, reseed, SEED } from '../../shared/seed';
import { ToastService } from '../../shared/toast.service';

const DEFAULT_FILTERS: DriverFilters = {
  query: '',
  status: 'all',
  docState: 'all',
  citizenship: 'all',
  workplace: 'all',
  problemsOnly: false,
};

@Injectable()
export class DriversStore {
  private readonly dataPort: DriversDataPort;
  private readonly toast: ToastService;

  private readonly list = signal<Driver[]>([]);
  private readonly filtersSignal = signal<DriverFilters>({ ...DEFAULT_FILTERS });
  private readonly selection = signal<Set<string>>(new Set());
  private readonly selectedId = signal<string | null>(null);
  private readonly loading = signal<boolean>(false);

  readonly filters = this.filtersSignal.asReadonly();
  readonly drivers = this.list.asReadonly();
  readonly filtered = computed(() => this.applyFilters(this.list(), this.filtersSignal()));
  readonly selectedDriver = computed(() =>
    this.list().find((driver) => driver.id === this.selectedId()) ?? null,
  );
  readonly selectedIds = computed(() => Array.from(this.selection()));
  readonly summary: Signal<DriversSummary> = computed(() => {
    const list = this.filtered();
    const summary: DriversSummary = {
      total: list.length,
      active: 0,
      onLeave: 0,
      inactive: 0,
      docsOk: 0,
      docsWarn: 0,
      docsBad: 0,
    };

    for (const driver of list) {
      if (driver.status === 'Active') {
        summary.active += 1;
      } else if (driver.status === 'OnLeave') {
        summary.onLeave += 1;
      } else {
        summary.inactive += 1;
      }

      const docState = worstDocState(driver.docs);
      if (docState === 'ok') {
        summary.docsOk += 1;
      } else if (docState === 'warn') {
        summary.docsWarn += 1;
      } else {
        summary.docsBad += 1;
      }
    }

    return summary;
  });
  readonly loadingState = this.loading.asReadonly();

  constructor(
    @Inject(DRIVERS_DATA) driversPort: DriversDataPort,
    toast: ToastService,
  ) {
    this.dataPort = driversPort;
    this.toast = toast;
    this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await this.dataPort.load();
      this.list.set(list);
    } catch (error) {
      console.error('Failed to load drivers', error);
      this.toast.open('Не удалось загрузить водителей');
      this.list.set(reseed());
    } finally {
      this.loading.set(false);
    }
  }

  setFilters(partial: Partial<DriverFilters>): void {
    this.filtersSignal.update((value) => ({ ...value, ...partial }));
  }

  setQuery(query: string): void {
    this.setFilters({ query });
  }

  resetFilters(): void {
    this.filtersSignal.set({ ...DEFAULT_FILTERS });
  }

  select(id: string | null): void {
    this.selectedId.set(id);
  }

  toggleSelection(id: string, value?: boolean): void {
    this.selection.update((set) => {
      const next = new Set(set);
      const shouldSelect = value ?? !next.has(id);
      if (shouldSelect) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  clearSelection(): void {
    this.selection.set(new Set());
  }

  setAllSelected(ids: string[], selected: boolean): void {
    this.selection.set(selected ? new Set(ids) : new Set());
  }

  private async persist(list: Driver[]): Promise<void> {
    try {
      await this.dataPort.save(list);
    } catch (error) {
      console.error('Failed to persist drivers', error);
      this.toast.open('Не удалось сохранить изменения');
    }
  }

  async set(list: Driver[]): Promise<void> {
    this.list.set(list);
    await this.persist(list);
  }

  async add(driver: Driver): Promise<void> {
    const list = [...this.list(), driver];
    await this.set(list);
    this.toast.open('Водитель добавлен', 'OK');
  }

  async removeMany(ids: string[]): Promise<void> {
    if (!ids.length) {
      return;
    }
    const list = this.list().filter((driver) => !ids.includes(driver.id));
    this.selection.set(new Set());
    if (ids.includes(this.selectedId() ?? '')) {
      this.select(null);
    }
    await this.set(list);
    this.toast.open(`Удалено: ${ids.length}`);
  }

  async activateMany(ids: string[]): Promise<void> {
    if (!ids.length) {
      return;
    }
    const list = this.list().map((driver) =>
      ids.includes(driver.id)
        ? { ...driver, status: 'Active' as Driver['status'] }
        : driver,
    );
    await this.set(list);
    this.toast.open(`Активировано: ${ids.length}`);
  }

  async reseed(): Promise<void> {
    const list = reseed();
    await this.set(list);
    this.toast.open('Демо-данные обновлены');
  }

  async reset(): Promise<void> {
    const list = SEED.map((driver) => ({ ...driver })) as Driver[];
    await this.set(list);
    this.toast.open('Демо-данные сброшены');
  }

  async addRandom(): Promise<void> {
    const driver = randomDriver();
    await this.add(driver);
  }

  async shiftDocs(id: string, days: number): Promise<void> {
    const list = this.list().map((driver) => {
      if (driver.id !== id) {
        return driver;
      }
      const updatedDocs = Object.fromEntries(
        Object.entries(driver.docs).map(([key, value]) => [
          key,
          {
            ...value,
            expires: value.expires + days * DAY_IN_MS,
          },
        ]),
      ) as Driver['docs'];
      return { ...driver, docs: updatedDocs };
    });
    await this.set(list);
    this.toast.open('Сроки документов обновлены');
  }

  private applyFilters(list: Driver[], filters: DriverFilters): Driver[] {
    const queryLower = filters.query.trim().toLowerCase();
    return list.filter((driver) => {
      if (filters.status !== 'all' && driver.status !== filters.status) {
        return false;
      }
      if (filters.citizenship !== 'all' && driver.citizenship !== filters.citizenship) {
        return false;
      }
      if (filters.workplace !== 'all' && driver.workplace !== filters.workplace) {
        return false;
      }
      const docState = worstDocState(driver.docs);
      if (filters.docState !== 'all' && docState !== filters.docState) {
        return false;
      }
      if (filters.problemsOnly && docState === 'ok') {
        return false;
      }
      if (queryLower) {
        const haystack = `${driver.fullName} ${driver.email} ${driver.phone} ${driver.workplace}`.toLowerCase();
        if (!haystack.includes(queryLower)) {
          return false;
        }
      }
      return true;
    });
  }

  docsState(driver: Driver): ReturnType<typeof daysToState> {
    const doc = Object.values(driver.docs).sort(
      (a, b) => a.expires - b.expires,
    )[0];
    const days = Math.round((doc.expires - Date.now()) / DAY_IN_MS);
    return daysToState(days);
  }
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
