import { NgModule, isDevMode, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  AuthHttpInterceptor,
  AuthModule as Auth0Module,
} from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { WithCredentialsInterceptor } from './interceptors/credentials-interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from './layout/header/header.component';
import { MainComponent } from './layout/main/main.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CustomersModule } from './modules/customers/customers.module';
import { MatMenuModule } from '@angular/material/menu';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { GlobalErrorHandler } from './errors/global-error-handler';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    AuthModule,
    DashboardModule,
    HttpClientModule,
    Auth0Module.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: `${window.location.origin}`,
        audience: environment.auth0.audience,
        scope: 'openid profile email offline_access',
        prompt: 'select_account',
      },
      useRefreshTokens: true,
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.apiUrl}*`,
            allowAnonymous: true,
          },
        ],
      },
    }),
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    CustomersModule,
    MatMenuModule,
    PermissionsModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
