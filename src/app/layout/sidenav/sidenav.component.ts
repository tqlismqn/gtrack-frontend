import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { Modules } from '../../constants/modules';
import { PermissionAccessType } from '../../constants/permission-access';
import { takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit, OnDestroy {
  links: {
    name: string;
    link: string;
  }[] = [];

  destroy$ = new EventEmitter();

  constructor(
    public companyService: CompanyService,
    protected cdr: ChangeDetectorRef,
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
    if (this.checkPermission(Modules.CUSTOMERS)) {
      this.links.push({
        name: 'Address Book',
        link: 'customers',
      });
    }
    if (this.checkPermission(Modules.ORDERS)) {
      this.links.push({
        name: 'Orders',
        link: 'orders',
      });
    }
    if (this.checkPermission(Modules.PERMISSIONS)) {
      this.links.push({
        name: 'Permissions',
        link: 'permissions',
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
