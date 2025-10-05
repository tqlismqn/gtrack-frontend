import { Type } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';

import { environment } from '../../environments/environment';
import { DRIVERS_DATA } from './shared/data.port';
import { DriversApiService } from './features/drivers/drivers.data.api';
import { LocalDriversDataService } from './features/drivers/drivers.data.local';
import { DemoApiInterceptor } from './shared/demo-api.interceptor';

const shellComponentPlaceholder = null as unknown as Type<unknown>;

const shouldUseApi = (environment as { demoUseApi?: boolean }).demoUseApi ?? false;

export const DEMO_ROUTES: Routes = [
  {
    path: '',
    component: shellComponentPlaceholder,
    providers: [
      provideHttpClient(
        ...(shouldUseApi ? [] : [withInterceptors([() => new DemoApiInterceptor()])]),
      ),
      {
        provide: DRIVERS_DATA,
        useFactory: (api: DriversApiService, local: LocalDriversDataService) =>
          ((environment as { demoUseApi?: boolean }).demoUseApi ?? false) ? api : local,
        deps: [DriversApiService, LocalDriversDataService],
      },
    ],
    children: [],
  },
];
