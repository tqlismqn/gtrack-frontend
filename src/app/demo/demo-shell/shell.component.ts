import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { firstValueFrom, map, shareReplay } from 'rxjs';
import { ThemeService } from '../shared/theme.service';
import { DemoSearchService } from '../shared/search.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface MenuItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-demo-shell',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly searchService = inject(DemoSearchService);

  readonly menu: MenuItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', path: 'dashboard' },
    { label: 'Address Book', icon: 'book', path: 'address-book' },
    { label: 'Orders', icon: 'shopping_bag', path: 'orders' },
    { label: 'Invoices', icon: 'receipt_long', path: 'invoices' },
    { label: 'Drivers', icon: 'local_shipping', path: 'drivers' },
    { label: 'Settings', icon: 'settings', path: 'settings' },
  ];

  readonly themeMode: Signal<'light' | 'dark'> = this.theme.theme;
  readonly isHandset$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait, Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  readonly searchControl = new FormControl('', { nonNullable: true });

  opened = true;

  ngOnInit(): void {
    this.searchControl.setValue(this.searchService.term(), { emitEvent: false });
    this.searchControl.valueChanges
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe((value) => this.searchService.setTerm(value));

    this.isHandset$.subscribe((handset) => {
      this.opened = !handset;
    });
  }

  toggleSidenav(drawer: { toggle: () => void }): void {
    drawer.toggle();
  }

  async navigate(path: string, drawer: { close: () => void }): Promise<void> {
    await this.router.navigate(['demo', path]);
    const handset = await firstValueFrom(this.isHandset$);
    if (handset) {
      drawer.close();
    }
  }

  toggleTheme(): void {
    this.theme.toggle();
  }
}
