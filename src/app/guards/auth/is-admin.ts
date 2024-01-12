import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { Roles } from '../../modules/admin/types/roles';

export const isAdmin: CanActivateFn = () => {
  const companyService = inject(CompanyService);
  const router = inject(Router);

  const result =
    companyService.selectedCompany?.role === Roles.SuperAdmin ||
    companyService.selectedCompany?.role === Roles.Admin;

  if (!result) {
    router.navigate(['/dashboard']);
  }

  return result;
};
