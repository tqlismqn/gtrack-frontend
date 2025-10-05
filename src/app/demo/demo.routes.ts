import { Routes } from '@angular/router';
import { ShellComponent } from './demo-shell/shell.component';

export const DEMO_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'address-book',
        loadComponent: () =>
          import('./features/address-book/address-book.component').then((m) => m.AddressBookComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./features/invoices/invoices.component').then((m) => m.InvoicesComponent),
      },
      {
        path: 'drivers',
        loadComponent: () => import('./features/drivers/drivers.page').then((m) => m.DriversPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/permissions/permissions.component').then((m) => m.PermissionsComponent),
      },
    ],
  },
];
