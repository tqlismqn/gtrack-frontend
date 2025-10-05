import { Injectable } from '@angular/core';
import { Driver, DriversDataPort } from '../../shared/data.port';

export const DRIVERS_STORAGE_KEY = 'gtrack_demo_drivers_v4';

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `drv_${Math.random().toString(16).slice(2)}_${Date.now()}`;
};

const futureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const pastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const DRIVER_SEED_BASE: Omit<Driver, 'id'>[] = [
  {
    fullName: 'Marek Král',
    rc: '820312/2145',
    email: 'marek.kral@example.cz',
    phone: '+420 737 244 889',
    status: 'Active',
    citizenship: 'CZ',
    workplace: 'Praha',
    hireDate: '2022-03-11',
    contractType: 'HPP',
    pasSouhlas: true,
    propiskaCZ: true,
    docs: {
      passport: { expires: futureDate(300), uploaded: true },
      visa: { expires: futureDate(90), uploaded: true },
      license: { expires: futureDate(120), uploaded: true },
      code95: { expires: futureDate(220), uploaded: true },
      tachograph: { expires: futureDate(60), uploaded: true },
      medical: { expires: futureDate(160), uploaded: true },
      adr: { expires: futureDate(200), uploaded: true },
    },
    salary: { base: 32000, bonus: 2800, deductions: 1100, trips: 6, perDiem: 900 },
  },
  {
    fullName: 'Elena Novotná',
    rc: '950215/8811',
    email: 'elena.novotna@example.cz',
    phone: '+420 734 123 789',
    status: 'Active',
    citizenship: 'EU',
    workplace: 'Praha',
    hireDate: '2023-02-14',
    contractType: 'Срочный',
    pasSouhlas: false,
    propiskaCZ: true,
    docs: {
      passport: { expires: futureDate(400), uploaded: true },
      visa: { expires: futureDate(250), uploaded: true },
      license: { expires: futureDate(75), uploaded: true },
      code95: { expires: futureDate(180), uploaded: true },
      tachograph: { expires: futureDate(90), uploaded: true },
      medical: { expires: futureDate(45), uploaded: true },
      adr: { expires: futureDate(160), uploaded: true },
    },
    salary: { base: 27000, bonus: 3000, deductions: 900, trips: 5, perDiem: 850 },
  },
  {
    fullName: 'Igor Shevchenko',
    rc: '870621/4412',
    email: 'igor.shevchenko@example.cz',
    phone: '+420 602 655 188',
    status: 'On leave',
    citizenship: 'UA',
    workplace: 'Brno',
    hireDate: '2021-11-02',
    contractType: 'HPP',
    pasSouhlas: true,
    propiskaCZ: false,
    docs: {
      passport: { expires: futureDate(90), uploaded: true },
      visa: { expires: pastDate(15), uploaded: true },
      license: { expires: futureDate(30), uploaded: true },
      code95: { expires: futureDate(12), uploaded: true },
      tachograph: { expires: pastDate(2), uploaded: false },
      medical: { expires: futureDate(200), uploaded: true },
      adr: { expires: futureDate(60), uploaded: true },
    },
    salary: { base: 24000, bonus: 1800, deductions: 800, trips: 3, perDiem: 780 },
  },
  {
    fullName: 'Karolina Veselá',
    rc: '930902/0084',
    email: 'karolina.vesela@example.cz',
    phone: '+420 773 491 028',
    status: 'Active',
    citizenship: 'CZ',
    workplace: 'Ostrava',
    hireDate: '2020-08-20',
    contractType: 'HPP',
    pasSouhlas: true,
    propiskaCZ: true,
    docs: {
      passport: { expires: futureDate(650), uploaded: true },
      visa: { expires: futureDate(280), uploaded: true },
      license: { expires: futureDate(45), uploaded: true },
      code95: { expires: futureDate(60), uploaded: true },
      tachograph: { expires: futureDate(30), uploaded: true },
      medical: { expires: futureDate(15), uploaded: true },
      adr: { expires: futureDate(330), uploaded: true },
    },
    salary: { base: 29500, bonus: 2400, deductions: 650, trips: 8, perDiem: 920 },
  },
  {
    fullName: 'Tomas Černý',
    rc: '900125/5110',
    email: 'tomas.cerny@example.cz',
    phone: '+420 728 490 321',
    status: 'Active',
    citizenship: 'CZ',
    workplace: 'Plzeň',
    hireDate: '2019-05-01',
    contractType: 'HPP',
    pasSouhlas: true,
    propiskaCZ: true,
    docs: {
      passport: { expires: futureDate(140), uploaded: true },
      visa: { expires: futureDate(140), uploaded: true },
      license: { expires: pastDate(10), uploaded: true },
      code95: { expires: futureDate(22), uploaded: true },
      tachograph: { expires: pastDate(30), uploaded: false },
      medical: { expires: futureDate(75), uploaded: true },
      adr: { expires: futureDate(190), uploaded: true },
    },
    salary: { base: 31000, bonus: 2100, deductions: 1000, trips: 4, perDiem: 840 },
  },
];

const createSeed = (): Driver[] => DRIVER_SEED_BASE.map((item) => ({ ...item, id: createId() }));

const getStorage = (): Storage | undefined => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // ignore
  }
  return undefined;
};

export const readDriversFromStorage = (): Driver[] => {
  const storage = getStorage();
  if (!storage) {
    return createSeed();
  }
  try {
    const raw = storage.getItem(DRIVERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Driver[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeDriversToStorage = (list: Driver[]): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore write errors in demo mode
  }
};

export const ensureDriversSeed = (): Driver[] => {
  const existing = readDriversFromStorage();
  if (existing.length > 0) {
    return existing;
  }
  const seeded = createSeed();
  writeDriversToStorage(seeded);
  return seeded;
};

const mergeDocs = (original: Driver['docs'], patch?: Partial<Driver['docs']>) => {
  if (!patch) {
    return original;
  }
  return { ...original, ...patch };
};

const mergeSalary = (original: Driver['salary'], patch?: Partial<Driver['salary']>) => {
  if (!patch) {
    return original;
  }
  return { ...original, ...patch };
};

@Injectable({ providedIn: 'root' })
export class LocalDriversDataService implements DriversDataPort {
  async load(): Promise<Driver[]> {
    return [...ensureDriversSeed()];
  }

  async save(list: Driver[]): Promise<void> {
    writeDriversToStorage(list);
  }

  async add(driver: Driver): Promise<Driver> {
    const list = ensureDriversSeed();
    const record: Driver = { ...driver, id: driver.id || createId() };
    writeDriversToStorage([record, ...list]);
    return record;
  }

  async update(id: string, patch: Partial<Driver>): Promise<Driver> {
    const list = ensureDriversSeed();
    let next: Driver | undefined;
    const updated = list.map((item) => {
      if (item.id !== id) {
        return item;
      }
      next = {
        ...item,
        ...patch,
        docs: mergeDocs(item.docs, patch.docs),
        salary: mergeSalary(item.salary, patch.salary),
      };
      return next;
    });
    if (!next) {
      throw new Error(`Driver with id ${id} not found`);
    }
    writeDriversToStorage(updated);
    return next;
  }

  async removeMany(ids: string[]): Promise<void> {
    if (!ids.length) {
      return;
    }
    const set = new Set(ids);
    const list = ensureDriversSeed();
    const filtered = list.filter((item) => !set.has(item.id));
    writeDriversToStorage(filtered);
  }
}
