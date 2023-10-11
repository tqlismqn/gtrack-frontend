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
import { Modules } from './constants/modules';
import { haveWriteAccess } from './guards/modules/have-write-access';
import { CustomersCreateComponent } from './modules/customers/components/customers-create/customers-create.component';
import { CustomersTableComponent } from './modules/customers/components/customers-table/customers-table.component';
import { PermissionsTableComponent } from './modules/permissions/components/permissions-table/permissions-table.component';
import { PermissionsCreateComponent } from './modules/permissions/components/permissions-create/permissions-create.component';

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
            canActivate: [haveReadAccess(Modules.CUSTOMERS)],
            path: 'customers',
            component: CustomersTableComponent,
            runGuardsAndResolvers: 'always',
          },
          {
            canActivate: [haveWriteAccess(Modules.CUSTOMERS)],
            path: 'customers/create',
            component: CustomersCreateComponent,
            runGuardsAndResolvers: 'always',
          },

          {
            canActivate: [haveReadAccess(Modules.PERMISSIONS)],
            path: 'permissions',
            component: PermissionsTableComponent,
            runGuardsAndResolvers: 'always',
          },
          {
            canActivate: [haveWriteAccess(Modules.PERMISSIONS)],
            path: 'permissions/create',
            component: PermissionsCreateComponent,
            runGuardsAndResolvers: 'always',
          },

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
