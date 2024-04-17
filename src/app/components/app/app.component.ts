import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    provideMomentDateAdapter(),
  ],
})
export class AppComponent implements OnInit {
  loaded = false;

  constructor(
    protected auth: AuthService,
    protected cdr: ChangeDetectorRef,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {}
  ngOnInit() {
    this.auth.auth0.isAuthenticated$.subscribe((auth) => {
      if (!auth) {
        this.loaded = true;
        this.cdr.markForCheck();
        return;
      }

      this.auth.isApplicationReady().subscribe(() => {
        this.loaded = true;
        this.cdr.markForCheck();
      });
    });
    this._adapter.setLocale(navigator.language);
  }
}
