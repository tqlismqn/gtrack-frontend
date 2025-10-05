import { EventEmitter, Injectable } from '@angular/core';
import { WaveConnector } from 'laravel-wave';
import Echo from 'laravel-echo';
import { environment } from '../../environments/environment';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { DEMO_MODE } from '../demo.config';

const IS_DEMO_MODE = environment.demoMode || DEMO_MODE;

@Injectable({ providedIn: 'root' })
export class SseService {
  echo!: Echo<any>;
  init = false;
  init$ = new EventEmitter<void>();

  constructor(protected auth0: Auth0Service) {}

  initService() {
    return new Observable<void>((subscriber) => {
      if (IS_DEMO_MODE) {
        this.init = true;
        this.init$.emit();
        subscriber.next();
        subscriber.complete();
        return;
      }

      this.auth0.isAuthenticated$.subscribe((value) => {
        if (!value) {
          return;
        }

        this.auth0
          .getAccessTokenSilently({
            cacheMode: 'on',
          })
          .subscribe((token) => {
            this.echo = new Echo({
              broadcaster: WaveConnector,
              bearerToken: token,
              authEndpoint: `${environment.apiUrl}/broadcasting/auth`,
              endpoint: `${environment.apiUrl}/wave`,
              debug: true,
            });
            this.init = true;
            this.init$.emit();

            subscriber.next();
            subscriber.complete();
          });
      });
    });
  }
}
