import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';
import { Observable } from 'rxjs';

export const isAuthenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Observable<boolean>((subscriber) => {
    authService.auth0.isAuthenticated$.subscribe((isAuth) => {
      if (!isAuth) {
        router.navigate(['/login']).then(() => {
          subscriber.next(false);
          subscriber.complete();
        });
        return;
      }

      authService.isApplicationReady().subscribe((ready) => {
        subscriber.next(ready);
        subscriber.complete();
      });
    });
  });
};
