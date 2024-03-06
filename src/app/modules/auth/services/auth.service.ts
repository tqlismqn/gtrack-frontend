import { Injectable } from '@angular/core';
import {
  AuthService as Auth0Service,
  User as Auth0User,
} from '@auth0/auth0-angular';
import { combineLatest, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User, UserResponse } from '../types/user';
import { CompanyService } from '../../../services/company.service';
import { Router } from '@angular/router';
import { GlobalErrorHandler } from '../../../errors/global-error-handler';
import { Roles } from '../../admin/types/roles';
import { SseService } from '../../../services/sse.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected _isApplicationReady$?: Subject<boolean>;
  protected _isApplicationReady?: boolean;

  public user?: User;
  public auth0User?: Auth0User;

  constructor(
    public auth0: Auth0Service,
    public http: HttpClient,
    public companyService: CompanyService,
    protected router: Router,
    protected errorHandler: GlobalErrorHandler,
    protected sseService: SseService,
  ) {
    errorHandler.auth = this;

    auth0.error$.subscribe((error) => {
      // @ts-ignore
      switch (error.error) {
        case 'invalid_grant':
        case 'login_required':
          errorHandler.authorizationExpiredError();
          break;
      }
    });

    companyService.companyChanged$.subscribe(() => {
      if (!this.router.navigated) {
        return;
      }
      this.router.navigateByUrl(this.router.url);
    });
  }

  getUserInfo(): Observable<User> {
    return new Observable<User>((subscriber) => {
      this.http.get(`${environment.apiUrl}/api/v1/user`).subscribe({
        next: (response) => {
          const data = response as UserResponse;
          this.user = data;
          subscriber.next(data);
          subscriber.complete();
        },
        error: (error) => {
          subscriber.error(error);
          subscriber.complete();
        },
      });
    });
  }

  isApplicationReady(): Observable<boolean> {
    const onError = (error: any) => {
      this._isApplicationReady = false;
      if (this._isApplicationReady$) {
        this._isApplicationReady$.next(false);
        this._isApplicationReady$.closed = true;
      }
      this.errorHandler.handleError(error);
    };

    return new Observable<boolean>((subscriber) => {
      if (this._isApplicationReady !== undefined) {
        subscriber.next(this._isApplicationReady);
        subscriber.complete();
        return;
      }

      if (!this._isApplicationReady$) {
        this._isApplicationReady$ = new Subject<boolean>();

        combineLatest([this.auth0.user$, this.getUserInfo()]).subscribe({
          next: ([auth0User]) => {
            if (auth0User) {
              this.auth0User = auth0User;
            }

            combineLatest([
              this.companyService.fetch(),
              this.sseService.initService(),
            ]).subscribe({
              next: () => {
                this._isApplicationReady = true;
                if (this._isApplicationReady$) {
                  this._isApplicationReady$.next(true);
                  this._isApplicationReady$.closed = true;
                }
              },
              error: (err) => onError(err),
            });
          },
          error: (err) => onError(err),
        });
      }

      this._isApplicationReady$.subscribe((value) => {
        subscriber.next(value);
        subscriber.complete();
      });
    });
  }

  logout(returnTo?: string) {
    this.auth0.logout({
      logoutParams: {
        returnTo: returnTo ?? location.origin,
      },
    });
  }

  get isAdmin() {
    return (
      this.isSuperAdmin ||
      this.companyService.selectedCompany?.role === Roles.Admin
    );
  }

  get isSuperAdmin() {
    return this.companyService.selectedCompany?.role === Roles.SuperAdmin;
  }
}
