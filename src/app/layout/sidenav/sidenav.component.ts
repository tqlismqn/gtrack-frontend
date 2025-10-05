import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuGroup } from '../menu.config';
import { MenuService } from '../menu.service';

@Component({
  standalone: false,
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnDestroy {
  menuGroups: MenuGroup[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly menuService: MenuService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.menuService.menu$
      .pipe(takeUntil(this.destroy$))
      .subscribe((groups) => {
        this.menuGroups = groups;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
