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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
