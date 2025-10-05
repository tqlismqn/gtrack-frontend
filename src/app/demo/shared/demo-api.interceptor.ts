import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Driver } from './data.port';
import {
  ensureDriversSeed,
  readDriversFromStorage,
  writeDriversToStorage,
} from '../features/drivers/drivers.data.local';

const normalizeBase = (base: string | undefined) => {
  if (!base) {
    return '/api';
  }
  const trimmed = base.trim();
  if (!trimmed) {
    return '/api';
  }
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
};

const stripOrigin = (url: string) => url.replace(/^https?:\/\/[^/]+/i, '');

const extractPath = (url: string) => {
  const withoutOrigin = stripOrigin(url);
  const end = withoutOrigin.indexOf('?');
  const hashIndex = withoutOrigin.indexOf('#');
  const cutIndex = [end, hashIndex].filter((value) => value >= 0).sort((a, b) => a - b)[0];
  return cutIndex >= 0 ? withoutOrigin.slice(0, cutIndex) : withoutOrigin;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `drv_${Math.random().toString(16).slice(2)}_${Date.now()}`;
};

const cloneDrivers = (drivers: Driver[]): Driver[] => drivers.map((item) => ({
  ...item,
  docs: { ...item.docs },
  salary: { ...item.salary },
}));

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

@Injectable()
export class DemoApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const useApi = (environment as { demoUseApi?: boolean }).demoUseApi ?? false;
    if (useApi) {
      return next.handle(req);
    }

    const base = `${normalizeBase((environment as { demoApiBase?: string }).demoApiBase)}/drivers`;
    const path = extractPath(req.url || req.urlWithParams);

    if (!path.startsWith(base)) {
      return next.handle(req);
    }

    const method = req.method.toUpperCase();
    const current = ensureDriversSeed();
    const getList = () => {
      const stored = readDriversFromStorage();
      if (!stored.length) {
        writeDriversToStorage(current);
        return cloneDrivers(current);
      }
      return cloneDrivers(stored);
    };

    if (method === 'GET' && path === base) {
      return of(new HttpResponse({ status: 200, body: getList() }));
    }

    if (method === 'PUT' && path === base) {
      const payload = Array.isArray(req.body) ? (req.body as Driver[]) : [];
      writeDriversToStorage(cloneDrivers(payload));
      return of(new HttpResponse({ status: 204 }));
    }

    if (method === 'POST' && path === base) {
      const payload = (req.body || {}) as Partial<Driver>;
      const driver: Driver = {
        id: typeof payload.id === 'string' && payload.id ? payload.id : createId(),
        fullName: payload.fullName ?? 'Unknown Driver',
        rc: payload.rc ?? '',
        email: payload.email ?? '',
        phone: payload.phone ?? '',
        status: payload.status ?? 'Active',
        citizenship: payload.citizenship ?? '',
        workplace: payload.workplace ?? '',
        hireDate: payload.hireDate ?? null,
        contractType: payload.contractType ?? 'HPP',
        pasSouhlas: payload.pasSouhlas ?? false,
        propiskaCZ: payload.propiskaCZ ?? false,
        docs: { ...(payload.docs ?? {}) },
        salary: {
          base: payload.salary?.base ?? 0,
          bonus: payload.salary?.bonus ?? 0,
          deductions: payload.salary?.deductions ?? 0,
          trips: payload.salary?.trips ?? 0,
          perDiem: payload.salary?.perDiem ?? 0,
        },
      };
      const nextList = [driver, ...getList()];
      writeDriversToStorage(nextList);
      return of(new HttpResponse({ status: 201, body: driver }));
    }

    const idMatch = path.match(/\/drivers\/([^/?#]+)/);
    if (idMatch) {
      const id = decodeURIComponent(idMatch[1]);

      if (method === 'PUT' || method === 'PATCH') {
        const payload = (req.body || {}) as Partial<Driver>;
        const updatedList: Driver[] = [];
        let updatedDriver: Driver | undefined;
        for (const driver of getList()) {
          if (driver.id === id) {
            updatedDriver = {
              ...driver,
              ...payload,
              docs: mergeDocs(driver.docs, payload.docs),
              salary: mergeSalary(driver.salary, payload.salary),
            };
            updatedList.push(updatedDriver);
          } else {
            updatedList.push(driver);
          }
        }
        if (!updatedDriver) {
          return of(new HttpResponse({ status: 404 }));
        }
        writeDriversToStorage(updatedList);
        return of(new HttpResponse({ status: 200, body: updatedDriver }));
      }

      if (method === 'DELETE') {
        const list = getList().filter((driver) => driver.id !== id);
        writeDriversToStorage(list);
        return of(new HttpResponse({ status: 204 }));
      }
    }

    if (method === 'DELETE' && path === base) {
      const ids: string[] = Array.isArray((req.body as any)?.ids)
        ? ((req.body as any).ids as string[])
        : [];
      if (!ids.length) {
        return of(new HttpResponse({ status: 204 }));
      }
      const set = new Set(ids);
      const list = getList().filter((driver) => !set.has(driver.id));
      writeDriversToStorage(list);
      return of(new HttpResponse({ status: 204 }));
    }

    return next.handle(req);
  }
}
