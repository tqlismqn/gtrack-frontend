import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CompanyService } from '../../services/company.service';

export const isUserNotHaveCompany: CanActivateFn = () => {
  const authService = inject(CompanyService);
  const router = inject(Router);

  const haveCompany = authService.companies.length > 0;
  if (haveCompany) {
    router.navigate(['/dashboard']);
  }

  return !haveCompany;
};
