import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User, UserResponse } from '../types/user';
import { CompanyService } from '../../../services/company.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected _isApplicationReady$?: Subject<boolean>;
  protected _isApplicationReady?: boolean;

  public user?: User;

  constructor(
    public auth0: Auth0Service,
    public http: HttpClient,
    public companyService: CompanyService,
  ) {}

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
      console.error(error);
      this._isApplicationReady = false;
      if (this._isApplicationReady$) {
        this._isApplicationReady$.next(false);
        this._isApplicationReady$.closed = true;
      }
    };

    return new Observable<boolean>((subscriber) => {
      if (this._isApplicationReady !== undefined) {
        subscriber.next(this._isApplicationReady);
        subscriber.complete();
        return;
      }

      if (!this._isApplicationReady$) {
        this._isApplicationReady$ = new Subject<boolean>();

        this.getUserInfo().subscribe({
          next: () => {
            this.companyService.fetchCompanies().subscribe({
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
}
