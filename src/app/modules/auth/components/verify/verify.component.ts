import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { GlobalErrorHandler } from '../../../../errors/global-error-handler';
import { initialQueryParams } from '../../../../../main';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyComponent implements OnInit {
  redirectInProcess = true;

  email?: string;
  sent = false;
  loading = false;

  @ViewChild('authForm')
  authForm?: AuthFormComponent;

  constructor(
    protected auth: AuthService,
    protected cdr: ChangeDetectorRef,
    protected http: HttpClient,
    protected errorHandler: GlobalErrorHandler,
  ) {
    auth.auth0.user$.subscribe((user) => {
      this.email = user?.email;
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {
    if (initialQueryParams.get('email_verification_state') !== 'updated') {
      this.auth.auth0.loginWithRedirect({
        authorizationParams: {
          prompt: 'none',
          redirect_uri: `${location.origin}?email_verification_state=updated`,
        },
      });
    } else {
      this.redirectInProcess = false;
    }
  }

  sendVerificationEmail() {
    this.auth.auth0.user$.subscribe((user) => {
      this.authForm?.startLoading();
      this.http
        .post(`${environment.apiUrl}/api/v1/user/resend-verification-email`, {
          auth0_id: user?.sub,
        })
        .subscribe({
          next: () => {
            this.authForm?.endLoading('success');
            this.sent = true;
            this.cdr.markForCheck();
          },
          error: (error) => {
            this.authForm?.endLoading('error');
            this.errorHandler.handleError(error);
          },
        });
    });
  }
}
