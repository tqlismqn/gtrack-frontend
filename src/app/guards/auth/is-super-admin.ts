import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';

export const isSuperAdmin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const result = authService.user?.role_id === 'super_admin';

  if (!result) {
    router.navigate(['/dashboard']);
  }

  return result;
};
