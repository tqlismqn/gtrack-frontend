import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';
import { Observable } from 'rxjs';

export const isVerified: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Observable<boolean>((subscriber) => {
    authService.auth0.user$.subscribe((user) => {
      if (user && !user.email_verified) {
        router.navigate(['/verify']);
        subscriber.next(false);
        subscriber.complete();
      } else {
        subscriber.next(true);
        subscriber.complete();
      }
    });
  });
};
