import { Injectable } from '@angular/core';
import { DriversDataPort } from '../../shared/data.port';
import { Driver } from '../../shared/models';
import { StorageService } from '../../shared/storage.service';
import { reseed, SEED } from '../../shared/seed';

@Injectable()
export class LocalDriversDataService implements DriversDataPort {
  constructor(private readonly storage: StorageService) {}

  async load(): Promise<Driver[]> {
    const stored = this.storage.getItem<Driver[]>(this.storage.driversKey);
    if (stored && Array.isArray(stored) && stored.length) {
      return stored;
    }
    const seeded = reseed();
    await this.save(seeded);
    return seeded;
  }

  async save(list: Driver[]): Promise<void> {
    this.storage.setItem(this.storage.driversKey, list);
  }

  async reset(): Promise<Driver[]> {
    await this.save(SEED);
    return SEED;
  }
}
