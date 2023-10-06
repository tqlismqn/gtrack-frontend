import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loaded = false;

  constructor(
    protected auth: AuthService,
    protected cdr: ChangeDetectorRef,
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
  }
}
