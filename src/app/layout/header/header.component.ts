import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../modules/auth/services/auth.service';
import { merge, Subject, takeUntil } from 'rxjs';
import { MenuItem } from '../menu.config';
import { MenuService } from '../menu.service';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  menuItems: MenuItem[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    public companyService: CompanyService,
    public auth: AuthService,
    protected cdr: ChangeDetectorRef,
    private readonly menuService: MenuService,
  ) {
    merge(
      this.companyService.companiesUpdated$,
      this.companyService.companyChanged$,
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });

    this.menuService.menu$
      .pipe(takeUntil(this.destroy$))
      .subscribe((groups) => {
        this.menuItems = groups.flatMap((group) => group.items);
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
