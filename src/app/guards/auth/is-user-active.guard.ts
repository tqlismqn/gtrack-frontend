import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';

export const isUserActive: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isActive = !!authService.user?.is_active;
  if (!isActive) {
    router.navigate(['/user-survey']);
  }

  return isActive;
};
