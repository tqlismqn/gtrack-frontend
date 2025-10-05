import { Injectable } from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { environment } from '../../environments/environment';
import { DEMO_MODE } from '../demo.config';
import { MenuGroup, MenuItem, MENU } from './menu.config';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../modules/auth/services/auth.service';
import { Modules, AdminModules, SuperAdminModules } from '../constants/modules';
import { PermissionAccessType } from '../constants/permission-access';

const ORDER_FALLBACK = Number.MAX_SAFE_INTEGER;

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly isDemoMode = environment.demoMode || DEMO_MODE;
  private readonly menuSubject = new BehaviorSubject<MenuGroup[]>(this.computeMenu());

  readonly menu$ = this.menuSubject.asObservable();

  constructor(
    private readonly companyService: CompanyService,
    private readonly auth: AuthService,
  ) {
    merge(this.companyService.companyChanged$, this.companyService.companiesUpdated$).subscribe(
      () => this.refresh(),
    );
  }

  refresh(): void {
    this.menuSubject.next(this.computeMenu());
  }

  private computeMenu(): MenuGroup[] {
    const sortedGroups = [...MENU].sort(
      (a, b) => this.getOrder(a.order) - this.getOrder(b.order),
    );

    return sortedGroups
      .map<MenuGroup>((group) => ({
        ...group,
        items: [...group.items]
          .sort((a, b) => this.getOrder(a.order) - this.getOrder(b.order))
          .filter((item) => this.hasAccess(item)),
      }))
      .filter((group) => group.items.length > 0);
  }

  private hasAccess(item: MenuItem): boolean {
    if (this.isDemoMode) {
      return true;
    }

    const normalizedPath = this.normalizePath(item.path);

    switch (normalizedPath) {
      case Modules.CUSTOMERS:
      case Modules.PERMISSIONS:
      case Modules.ORDERS:
      case Modules.INVOICES:
        return this.hasModuleAccess(normalizedPath as Modules);
      case 'settings':
        return (
          !!this.companyService.selectedCompany?.owner ||
          this.auth.isAdmin ||
          this.auth.isSuperAdmin
        );
      case AdminModules.USERS:
      case AdminModules.ROLES:
        return this.auth.isAdmin;
      case SuperAdminModules.COMPANIES:
      case SuperAdminModules.USERS:
      case SuperAdminModules.BANK_COLLECTIONS:
        return this.auth.isSuperAdmin;
      default:
        return true;
    }
  }

  private hasModuleAccess(module: Modules): boolean {
    return this.companyService.haveAnyAccessTo(module, PermissionAccessType.READ);
  }

  private normalizePath(path: string): string {
    return path.replace(/^\//, '');
  }

  private getOrder(order?: number): number {
    return order ?? ORDER_FALLBACK;
  }
}
