import { InjectionToken } from '@angular/core';
import { Driver } from './models';

export interface DriversDataPort {
  load(): Promise<Driver[]>;
  save(list: Driver[]): Promise<void>;
}

export const DRIVERS_DATA = new InjectionToken<DriversDataPort>('DRIVERS_DATA');
