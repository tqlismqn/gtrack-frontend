import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Modules } from '../../constants/modules';
import { CompanyService } from '../../services/company.service';
import { PermissionAccessType } from '../../constants/permission-access';

export const haveWriteAccess = (module: Modules): CanActivateFn => {
  return () => {
    const companyService = inject(CompanyService);
    const router = inject(Router);
    return new Observable<boolean>((subscriber) => {
      const haveAccess = companyService.haveAnyAccessTo(
        module,
        PermissionAccessType.WRITE,
      );
      subscriber.next(haveAccess);
      subscriber.complete();

      if (!haveAccess) {
        router.navigateByUrl('/dashboard');
      }
    });
  };
};
