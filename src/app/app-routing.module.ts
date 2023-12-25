import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard/dashboard.component';
import { isAuthenticated } from './guards/auth/is-authenticated.guard';
import { isNotAuthenticated } from './guards/auth/is-not-authenticated.guard';
import { isUserActive } from './guards/auth/is-user-active.guard';
import { UserSurveyComponent } from './modules/auth/components/user-survey/user-survey.component';
import { isUserNotActive } from './guards/auth/is-user-not-active.guard';
import { isUserHaveCompany } from './guards/auth/is-user-have-company.guard';
import { isUserNotHaveCompany } from './guards/auth/is-user-not-have-company.guard';
import { CompanySurveyComponent } from './modules/auth/components/company-survey/company-survey.component';
import { MainComponent } from './layout/main/main.component';
import { haveReadAccess } from './guards/modules/have-read-access';
import { AdminModules, Modules, SuperAdminModules } from './constants/modules';
import { haveWriteAccess } from './guards/modules/have-write-access';
import { CustomersEditComponent } from './modules/customers/components/customers-edit/customers-edit.component';
import { CustomersTableComponent } from './modules/customers/components/customers-table/customers-table.component';
import { PermissionsTableComponent } from './modules/permissions/components/permissions-table/permissions-table.component';
import { PermissionsEditComponent } from './modules/permissions/components/permissions-edit/permissions-edit.component';
import { isSuperAdmin } from './guards/auth/is-super-admin';
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
import { CurrenciesTableComponent } from './modules/super-admin/components/currencies/currencies-table/currencies-table.component';
import { CurrenciesEditComponent } from './modules/super-admin/components/currencies/currencies-edit/currencies-edit.component';
import { SettingsFormComponent } from './modules/settings/components/settings-form/settings-form.component';
import { AdminRolesTableComponent } from './modules/admin/components/roles/admin-roles-table/admin-roles-table.component';
import { AdminRolesEditComponent } from './modules/admin/components/roles/admin-roles-edit/admin-roles-edit.component';
import { AdminUsersTableComponent } from './modules/admin/components/admin-users/admin-users-table/admin-users-table.component';
import { AdminUsersEditComponent } from './modules/admin/components/admin-users/admin-users-edit/admin-users-edit.component';
import { isAdmin } from './guards/auth/is-admin';
import { SuperAdminUsersTableComponent } from './modules/super-admin/components/users/super-admin-users-table/super-admin-users-table.component';
import { SuperAdminUsersEditComponent } from './modules/super-admin/components/users/super-admin-users-edit/super-admin-users-edit.component';

const modules = [
  {
    module: Modules.CUSTOMERS,
    readActivate: [haveReadAccess(Modules.CUSTOMERS)],
    writeActivate: [haveWriteAccess(Modules.CUSTOMERS)],
    tableComponent: CustomersTableComponent,
    editComponent: CustomersEditComponent,
  },
  {
    module: Modules.PERMISSIONS,
    readActivate: [haveReadAccess(Modules.PERMISSIONS)],
    writeActivate: [haveWriteAccess(Modules.PERMISSIONS)],
    tableComponent: PermissionsTableComponent,
    editComponent: PermissionsEditComponent,
  },
  {
    module: Modules.ORDERS,
    readActivate: [haveReadAccess(Modules.ORDERS)],
    writeActivate: [haveWriteAccess(Modules.ORDERS)],
    tableComponent: OrdersTableComponent,
    createComponent: OrdersCreateComponent,
    updateComponent: OrdersUpdateComponent,
  },
  {
    module: Modules.INVOICES,
    readActivate: [haveReadAccess(Modules.INVOICES)],
    writeActivate: [haveWriteAccess(Modules.INVOICES)],
    tableComponent: InvoicesTableComponent,
    createComponent: InvoicesEditComponent,
    updateComponent: InvoicesEditComponent,
  },

  {
    module: AdminModules.USERS,
    readActivate: [isAdmin],
    writeActivate: [isAdmin],
    tableComponent: AdminUsersTableComponent,
    editComponent: AdminUsersEditComponent,
  },
  {
    module: SuperAdminModules.USERS,
    readActivate: [isSuperAdmin],
    writeActivate: [isSuperAdmin],
    tableComponent: SuperAdminUsersTableComponent,
    editComponent: SuperAdminUsersEditComponent,
  },
  {
    module: SuperAdminModules.COMPANIES,
    readActivate: [isSuperAdmin],
    writeActivate: [isSuperAdmin],
    tableComponent: AdminCompaniesTableComponent,
    editComponent: AdminCompaniesEditComponent,
  },
  {
    module: AdminModules.ROLES,
    readActivate: [isAdmin],
    writeActivate: [isAdmin],
    tableComponent: AdminRolesTableComponent,
    editComponent: AdminRolesEditComponent,
  },
  {
    module: SuperAdminModules.BANK_COLLECTIONS,
    readActivate: [isSuperAdmin],
    writeActivate: [isSuperAdmin],
    tableComponent: BankCollectionTableComponent,
    editComponent: BankCollectionEditComponent,
  },
  {
    module: SuperAdminModules.CURRENCIES,
    readActivate: [isSuperAdmin],
    writeActivate: [isSuperAdmin],
    tableComponent: CurrenciesTableComponent,
    editComponent: CurrenciesEditComponent,
  },
];

const moduleRoutes: Routes = [];

for (const item of modules) {
  moduleRoutes.push(
    {
      canActivate: item.readActivate,
      path: item.module,
      component: item.tableComponent,
      runGuardsAndResolvers: 'always',
    },
    {
      canActivate: item.writeActivate,
      path: `${item.module}/create`,
      component: item.createComponent ?? item.editComponent,
      runGuardsAndResolvers: 'always',
      data: {
        type: 'create',
        module: item.module,
      },
    },
    {
      canActivate: item.writeActivate,
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
  canActivate: [
    haveReadAccess(Modules.INVOICES),
    haveReadAccess(Modules.ORDERS),
  ],
  path: `${Modules.INVOICES}-${Modules.ORDERS}`,
  component: InvoicesOrdersTableComponent,
  runGuardsAndResolvers: 'always',
});

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [isNotAuthenticated],
  },
  {
    path: '',
    canActivate: [isAuthenticated],
    children: [
      {
        canActivate: [isUserNotActive],
        path: 'user-survey',
        component: UserSurveyComponent,
      },
      {
        canActivate: [isUserActive, isUserNotHaveCompany],
        path: 'company-survey',
        component: CompanySurveyComponent,
      },
      {
        path: '',
        component: MainComponent,
        canActivate: [isUserActive, isUserHaveCompany],
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
      { path: '**', redirectTo: 'user-survey' },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
