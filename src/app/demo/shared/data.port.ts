import { InjectionToken } from '@angular/core';

export type DriverDocumentState = {
  expires: string | null;
  uploaded: boolean;
};

export type DriverDocuments = Record<string, DriverDocumentState>;

export type DriverSalary = {
  base: number;
  bonus: number;
  deductions: number;
  trips: number;
  perDiem: number;
};

export type Driver = {
  id: string;
  fullName: string;
  rc: string;
  email: string;
  phone: string;
  status: string;
  citizenship: string;
  workplace: string;
  hireDate: string | null;
  contractType: string;
  pasSouhlas: boolean;
  propiskaCZ: boolean;
  docs: DriverDocuments;
  salary: DriverSalary;
};

export interface DriversDataPort {
  load(): Promise<Driver[]>;
  save(list: Driver[]): Promise<void>;
  add?(driver: Driver): Promise<Driver>;
  update?(id: string, patch: Partial<Driver>): Promise<Driver>;
  removeMany?(ids: string[]): Promise<void>;
}

export const DRIVERS_DATA = new InjectionToken<DriversDataPort>('DRIVERS_DATA');
