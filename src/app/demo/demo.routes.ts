import { Injectable, InjectionToken, Provider } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

export type DemoDriver = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  licenseNumber?: string;
};

export type DemoDriverCreate = Omit<DemoDriver, 'id'>;
export type DemoDriverUpdate = Partial<DemoDriverCreate>;

export interface DriversDataSource {
  list(): Promise<DemoDriver[]>;
  create(payload: DemoDriverCreate): Promise<DemoDriver>;
  update(id: string, payload: DemoDriverUpdate): Promise<DemoDriver>;
  remove(id: string): Promise<void>;
}

export const DRIVERS_DATA = new InjectionToken<DriversDataSource>('DRIVERS_DATA');
export const DRIVERS_DATA_API = new InjectionToken<DriversDataSource>('DRIVERS_DATA_API');
export const DRIVERS_DATA_LOCAL = new InjectionToken<DriversDataSource>('DRIVERS_DATA_LOCAL');

@Injectable()
class DriversApiDataSource implements DriversDataSource {
  private readonly baseUrl = environment.demoApiBase.replace(/\/$/, '');

  constructor(private readonly http: HttpClient) {}

  list(): Promise<DemoDriver[]> {
    return firstValueFrom(
      this.http.get<DemoDriver[]>(`${this.baseUrl}/drivers`),
    );
  }

  create(payload: DemoDriverCreate): Promise<DemoDriver> {
    return firstValueFrom(
      this.http.post<DemoDriver>(`${this.baseUrl}/drivers`, payload),
    );
  }

  update(id: string, payload: DemoDriverUpdate): Promise<DemoDriver> {
    return firstValueFrom(
      this.http.put<DemoDriver>(`${this.baseUrl}/drivers/${id}`, payload),
    );
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/drivers/${id}`),
    );
  }
}

const FALLBACK_DRIVERS: DemoDriver[] = [
  {
    id: 'demo-driver-1',
    name: 'Alexei Popov',
    phone: '+41 44 123 45 67',
    email: 'alexei.popov@example.com',
    status: 'active',
    licenseNumber: 'CH-A1-4582',
  },
  {
    id: 'demo-driver-2',
    name: 'Marta Sánchez',
    phone: '+34 91 456 78 90',
    email: 'marta.sanchez@example.com',
    status: 'inactive',
    licenseNumber: 'ES-B2-9021',
  },
];

@Injectable()
class DriversLocalDataSource implements DriversDataSource {
  private readonly drivers: DemoDriver[] = FALLBACK_DRIVERS.map((driver) => ({
    ...driver,
  }));

  async list(): Promise<DemoDriver[]> {
    return this.cloneDrivers();
  }

  async create(payload: DemoDriverCreate): Promise<DemoDriver> {
    const driver: DemoDriver = {
      id: this.generateId(),
      ...payload,
    };
    this.drivers.unshift(driver);
    return { ...driver };
  }

  async update(id: string, payload: DemoDriverUpdate): Promise<DemoDriver> {
    const index = this.drivers.findIndex((driver) => driver.id === id);

    if (index === -1) {
      throw new Error(`Driver with id ${id} was not found.`);
    }

    const updated: DemoDriver = {
      ...this.drivers[index],
      ...payload,
      id,
    };

    this.drivers[index] = updated;

    return { ...updated };
  }

  async remove(id: string): Promise<void> {
    const index = this.drivers.findIndex((driver) => driver.id === id);

    if (index === -1) {
      return;
    }

    this.drivers.splice(index, 1);
  }

  private cloneDrivers(): DemoDriver[] {
    return this.drivers.map((driver) => ({ ...driver }));
  }

  private generateId(): string {
    const cryptoRef = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

    if (cryptoRef && 'randomUUID' in cryptoRef) {
      return cryptoRef.randomUUID();
    }

    return `driver-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export const demoRouteProviders: Provider[] = [
  provideHttpClient(withFetch()),
  { provide: DRIVERS_DATA_API, useClass: DriversApiDataSource },
  { provide: DRIVERS_DATA_LOCAL, useClass: DriversLocalDataSource },
  {
    provide: DRIVERS_DATA,
    useFactory: (
      api: DriversDataSource,
      local: DriversDataSource,
    ): DriversDataSource => (environment.demoUseApi ? api : local),
    deps: [DRIVERS_DATA_API, DRIVERS_DATA_LOCAL],
  },
];
