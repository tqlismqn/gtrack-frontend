import { Injectable } from '@angular/core';
import { Observable, EMPTY, of } from 'rxjs';
import {
  AuthService as Auth0Service,
  GetTokenSilentlyOptions,
  LogoutOptions,
  RedirectLoginOptions,
} from '@auth0/auth0-angular';
import { GetTokenSilentlyVerboseResponse } from '@auth0/auth0-spa-js';

@Injectable()
export class DemoAuth0Service implements Pick<
  Auth0Service,
  'user$' | 'isAuthenticated$' | 'error$' | 'logout' | 'loginWithRedirect' | 'getAccessTokenSilently'
> {
  readonly user$: Observable<null> = of(null);
  readonly isAuthenticated$: Observable<boolean> = of(true);
  readonly error$ = EMPTY;

  logout(_options?: LogoutOptions): Observable<void> {
    return of(void 0);
  }

  loginWithRedirect(_options?: RedirectLoginOptions<any>): Observable<void> {
    return of(void 0);
  }

  getAccessTokenSilently(
    options: GetTokenSilentlyOptions & { detailedResponse: true },
  ): Observable<GetTokenSilentlyVerboseResponse>;
  getAccessTokenSilently(
    options?: GetTokenSilentlyOptions,
  ): Observable<string>;
  getAccessTokenSilently(
    options?: GetTokenSilentlyOptions & { detailedResponse?: boolean },
  ): Observable<string | GetTokenSilentlyVerboseResponse> {
    if (options?.detailedResponse) {
      return of({
        access_token: 'demo-token',
        id_token: 'demo-id-token',
        scope: options.authorizationParams?.scope ?? '',
        expires_in: 0,
        token_type: 'Bearer',
      });
    }

    return of('demo-token');
  }
}
