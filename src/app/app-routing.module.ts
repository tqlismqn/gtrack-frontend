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
import { AdminModules, Modules } from './constants/modules';
import { haveWriteAccess } from './guards/modules/have-write-access';
import { CustomersEditComponent } from './modules/customers/components/customers-edit/customers-edit.component';
import { CustomersTableComponent } from './modules/customers/components/customers-table/customers-table.component';
import { PermissionsTableComponent } from './modules/permissions/components/permissions-table/permissions-table.component';
import { PermissionsEditComponent } from './modules/permissions/components/permissions-edit/permissions-edit.component';
import { isSuperAdmin } from './guards/auth/is-super-admin';
import { AdminUsersTableComponent } from './modules/admin/components/users/admin-users-table/admin-users-table.component';
import { AdminUsersEditComponent } from './modules/admin/components/users/admin-users-edit/admin-users-edit.component';
import { AdminCompaniesTableComponent } from './modules/admin/components/companies/admin-companies-table/admin-companies-table.component';
import { AdminCompaniesEditComponent } from './modules/admin/components/companies/admin-companies-edit/admin-companies-edit.component';

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
    module: AdminModules.USERS,
    readActivate: [isSuperAdmin],
    writeActivate: [isSuperAdmin],
    tableComponent: AdminUsersTableComponent,
    editComponent: AdminUsersEditComponent,
  },
  {
    module: AdminModules.COMPANIES,
    readActivate: [isSuperAdmin],
    writeActivate: [isSuperAdmin],
    tableComponent: AdminCompaniesTableComponent,
    editComponent: AdminCompaniesEditComponent,
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
      component: item.editComponent,
      runGuardsAndResolvers: 'always',
      data: {
        type: 'create',
        module: item.module,
      },
    },
    {
      canActivate: item.writeActivate,
      path: `${item.module}/update/:id`,
      component: item.editComponent,
      runGuardsAndResolvers: 'always',
      data: {
        type: 'update',
        module: item.module,
      },
    },
  );
}

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
