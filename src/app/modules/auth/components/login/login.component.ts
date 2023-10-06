import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  constructor(protected auth: AuthService) {}
  ngOnInit() {
    this.auth.auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login',
      },
    });
  }
}
