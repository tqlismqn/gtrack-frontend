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
import { AdminModules, Modules } from '../../constants/modules';
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

  adminContainer: Link[] = [];

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
    if (this.auth.isSuperAdmin) {
      this.adminContainer.push({
        name: 'Users',
        link: AdminModules.USERS,
      });
      this.adminContainer.push({
        name: 'Companies',
        link: AdminModules.COMPANIES,
      });
      this.adminContainer.push({
        name: 'Bank Collection',
        link: AdminModules.BANK_COLLECTIONS,
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
