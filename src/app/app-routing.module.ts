import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard/dashboard.component';
import { UserSurveyComponent } from './modules/auth/components/user-survey/user-survey.component';
import { CompanySurveyComponent } from './modules/auth/components/company-survey/company-survey.component';
import { MainComponent } from './layout/main/main.component';
import { AdminModules, Modules, SuperAdminModules } from './constants/modules';
import { CustomersEditComponent } from './modules/customers/components/customers-edit/customers-edit.component';
import { CustomersTableComponent } from './modules/customers/components/customers-table/customers-table.component';
import { PermissionsTableComponent } from './modules/permissions/components/permissions-table/permissions-table.component';
import { PermissionsEditComponent } from './modules/permissions/components/permissions-edit/permissions-edit.component';
import { AdminCompaniesTableComponent } from './modules/super-admin/components/companies/admin-companies-table/admin-companies-table.component';
import { AdminCompaniesEditComponent } from './modules/super-admin/components/companies/admin-companies-edit/admin-companies-edit.component';
import { BankCollectionTableComponent } from './modules/super-admin/components/bank-collection/bank-collection-table/bank-collection-table.component';
import { BankCollectionEditComponent } from './modules/super-admin/components/bank-collection/bank-collection-edit/bank-collection-edit.component';
import { OrdersTableComponent } from './modules/orders/components/orders-table/orders-table.component';
import { OrdersCreateComponent } from './modules/orders/components/orders-create/orders-create.component';
import { OrdersUpdateComponent } from './modules/orders/components/orders-update/orders-update.component';
import { InvoicesTableComponent } from './modules/invoices/components/invoices-table/invoices-table.component';
import { InvoicesEditComponent } from './modules/invoices/components/invoices-edit/invoices-edit.component';
import { InvoicesOrdersTableComponent } from './modules/invoices/components/invoices-orders-table/invoices-orders-table.component';
import { SettingsFormComponent } from './modules/settings/components/settings-form/settings-form.component';
import { AdminRolesTableComponent } from './modules/admin/components/roles/admin-roles-table/admin-roles-table.component';
import { AdminRolesEditComponent } from './modules/admin/components/roles/admin-roles-edit/admin-roles-edit.component';
import { AdminUsersTableComponent } from './modules/admin/components/admin-users/admin-users-table/admin-users-table.component';
import { AdminUsersEditComponent } from './modules/admin/components/admin-users/admin-users-edit/admin-users-edit.component';
import { SuperAdminUsersTableComponent } from './modules/super-admin/components/users/super-admin-users-table/super-admin-users-table.component';
import { SuperAdminUsersEditComponent } from './modules/super-admin/components/users/super-admin-users-edit/super-admin-users-edit.component';
import { VerifyComponent } from './modules/auth/components/verify/verify.component';

const modules = [
  {
    module: Modules.CUSTOMERS,
    tableComponent: CustomersTableComponent,
    editComponent: CustomersEditComponent,
  },
  {
    module: Modules.PERMISSIONS,
    tableComponent: PermissionsTableComponent,
    editComponent: PermissionsEditComponent,
  },
  {
    module: Modules.ORDERS,
    tableComponent: OrdersTableComponent,
    createComponent: OrdersCreateComponent,
    updateComponent: OrdersUpdateComponent,
  },
  {
    module: Modules.INVOICES,
    tableComponent: InvoicesTableComponent,
    createComponent: InvoicesEditComponent,
    updateComponent: InvoicesEditComponent,
  },

  {
    module: AdminModules.USERS,
    tableComponent: AdminUsersTableComponent,
    editComponent: AdminUsersEditComponent,
  },
  {
    module: SuperAdminModules.USERS,
    tableComponent: SuperAdminUsersTableComponent,
    editComponent: SuperAdminUsersEditComponent,
  },
  {
    module: SuperAdminModules.COMPANIES,
    tableComponent: AdminCompaniesTableComponent,
    editComponent: AdminCompaniesEditComponent,
  },
  {
    module: AdminModules.ROLES,
    tableComponent: AdminRolesTableComponent,
    editComponent: AdminRolesEditComponent,
  },
  {
    module: SuperAdminModules.BANK_COLLECTIONS,
    tableComponent: BankCollectionTableComponent,
    editComponent: BankCollectionEditComponent,
  },
];

const moduleRoutes: Routes = [];

for (const item of modules) {
  moduleRoutes.push(
    {
      path: item.module,
      component: item.tableComponent,
      runGuardsAndResolvers: 'always',
    },
    {
      path: `${item.module}/create`,
      component: item.createComponent ?? item.editComponent,
      runGuardsAndResolvers: 'always',
      data: {
        type: 'create',
        module: item.module,
      },
    },
    {
      path: `${item.module}/update/:id`,
      component: item.updateComponent ?? item.editComponent,
      runGuardsAndResolvers: 'always',
      data: {
        type: 'update',
        module: item.module,
      },
    },
  );
}

moduleRoutes.push({
  path: `${Modules.INVOICES}-${Modules.ORDERS}`,
  component: InvoicesOrdersTableComponent,
  runGuardsAndResolvers: 'always',
});

const routes: Routes = [
  ...APP_ROUTES,
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
  {
    path: '',
    children: [
      {
        path: 'user-survey',
        component: UserSurveyComponent,
      },
      {
        path: 'company-survey',
        component: CompanySurveyComponent,
      },
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },

          {
            path: 'settings',
            component: SettingsFormComponent,
          },

          ...moduleRoutes,

          { path: '**', redirectTo: 'dashboard' },
        ],
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
