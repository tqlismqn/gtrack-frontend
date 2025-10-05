import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Driver, DriversDataPort } from '../../shared/data.port';
import { environment } from '../../../../environments/environment';

const normalizeBase = (base: string | undefined) => {
  if (!base) {
    return '/api';
  }
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

@Injectable({ providedIn: 'root' })
export class DriversApiService implements DriversDataPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${normalizeBase(environment.demoApiBase)}/drivers`;

  load(): Promise<Driver[]> {
    return firstValueFrom(this.http.get<Driver[]>(this.baseUrl));
  }

  save(list: Driver[]): Promise<void> {
    return firstValueFrom(this.http.put<void>(this.baseUrl, list));
  }

  add(driver: Driver): Promise<Driver> {
    return firstValueFrom(this.http.post<Driver>(this.baseUrl, driver));
  }

  update(id: string, patch: Partial<Driver>): Promise<Driver> {
    return firstValueFrom(this.http.put<Driver>(`${this.baseUrl}/${id}`, patch));
  }

  removeMany(ids: string[]): Promise<void> {
    return firstValueFrom(
      this.http.request<void>('DELETE', this.baseUrl, { body: { ids } }),
    );
  }
}
