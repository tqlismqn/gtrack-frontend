import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';
import { Observable } from 'rxjs';

export const hasClientAuthentication: CanActivateFn = () => {
  const authService = inject(AuthService);

  return new Observable<boolean>((subscriber) => {
    authService.auth0.isAuthenticated$.subscribe((result) => {
      subscriber.next(result);
      subscriber.complete();
    });
  });
};
