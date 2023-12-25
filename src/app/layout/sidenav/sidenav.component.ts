import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CompanyService } from '../../services/company.service';
import {
  AdminModules,
  Modules,
  SuperAdminModules,
} from '../../constants/modules';
import { PermissionAccessType } from '../../constants/permission-access';
import { takeUntil, tap } from 'rxjs';
import { AuthService } from '../../modules/auth/services/auth.service';

type Link = {
  name: string;
  link: string;
};

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit, OnDestroy {
  links: Link[] = [];

  superAdminContainer: Link[] = [];
  adminContainer: Link[] = [];
  invoicesContainer: Link[] = [];

  destroy$ = new EventEmitter();

  @ViewChild('activeLink', { read: ElementRef })
  activeLink?: ElementRef;

  constructor(
    public companyService: CompanyService,
    protected cdr: ChangeDetectorRef,
    protected auth: AuthService,
  ) {
    companyService.companyChanged$
      .pipe(
        tap(() => {
          this.checkPermissions();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  ngOnInit() {
    this.checkPermissions();
  }

  checkPermissions() {
    this.links = [];
    this.adminContainer = [];
    this.invoicesContainer = [];
    if (this.checkPermission(Modules.CUSTOMERS)) {
      this.links.push({
        name: 'Address Book',
        link: 'customers',
      });
    }
    if (this.checkPermission(Modules.PERMISSIONS)) {
      this.links.push({
        name: 'Permissions',
        link: 'permissions',
      });
    }
    if (this.checkPermission(Modules.ORDERS)) {
      this.links.push({
        name: 'Orders',
        link: 'orders',
      });
    }
    if (this.companyService.selectedCompany?.owner) {
      this.links.push({
        name: 'Settings',
        link: 'settings',
      });
    }
    if (this.checkPermission(Modules.INVOICES)) {
      this.invoicesContainer.push({
        name: 'Invoices',
        link: 'invoices',
      });
    }
    if (
      this.checkPermission(Modules.INVOICES) &&
      this.checkPermission(Modules.ORDERS)
    ) {
      this.invoicesContainer.push({
        name: 'Orders',
        link: 'invoices-orders',
      });
    }
    if (this.auth.isAdmin) {
      this.adminContainer.push({
        name: 'Users',
        link: AdminModules.USERS,
      });
      this.adminContainer.push({
        name: 'Roles',
        link: AdminModules.ROLES,
      });
    }
    if (this.auth.isSuperAdmin) {
      this.superAdminContainer.push({
        name: 'Companies',
        link: SuperAdminModules.COMPANIES,
      });
      this.superAdminContainer.push({
        name: 'Users',
        link: SuperAdminModules.USERS,
      });
      this.superAdminContainer.push({
        name: 'Bank Collection',
        link: SuperAdminModules.BANK_COLLECTIONS,
      });
      this.superAdminContainer.push({
        name: 'Currencies',
        link: SuperAdminModules.CURRENCIES,
      });
    }

    this.cdr.markForCheck();
  }

  protected checkPermission(module: Modules) {
    return this.companyService.haveAnyAccessTo(
      module,
      PermissionAccessType.READ,
    );
  }
}
