import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo.routes').then((m) => m.DEMO_ROUTES),
  },
];
