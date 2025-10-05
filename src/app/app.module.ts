import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  AuthHttpInterceptor,
  AuthModule as Auth0Module,
  AuthService as Auth0Service,
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
import { AdminModule } from './modules/admin/admin.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { XSocketInterceptor } from './interceptors/x-socket-interceptor';
import { OrdersModule } from './modules/orders/orders.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ErrorDialogComponent } from './errors/error-dialog/error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SettingsModule } from './modules/settings/settings.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { MatIconModule } from '@angular/material/icon';
import { DEMO_MODE } from './demo.config';
import { DemoAuth0Service } from './modules/auth/services/demo-auth0.service';

const IS_DEMO_MODE = environment.demoMode || DEMO_MODE;

const AUTH0_CONFIG = environment.auth0;

const AUTH0_IMPORTS = !IS_DEMO_MODE && AUTH0_CONFIG
  ? [
      Auth0Module.forRoot({
        domain: AUTH0_CONFIG.domain,
        clientId: AUTH0_CONFIG.clientId,
        cacheLocation: 'localstorage',
        authorizationParams: {
          redirect_uri: `${window.location.origin}`,
          audience: AUTH0_CONFIG.audience,
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
    ]
  : [];

const AUTH_PROVIDERS = !IS_DEMO_MODE && AUTH0_CONFIG
  ? [{ provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }]
  : [{ provide: Auth0Service, useClass: DemoAuth0Service }];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    SidenavComponent,
    ErrorDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    DashboardModule,
    HttpClientModule,
    ...AUTH0_IMPORTS,
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
    AdminModule,
    MatExpansionModule,
    MatRippleModule,
    OrdersModule,
    InvoicesModule,
    MatDialogModule,
    SettingsModule,
    SuperAdminModule,
    MatIconModule,
  ],
  providers: [
    ...AUTH_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XSocketInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    GlobalErrorHandler,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
