import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { AuthFormComponent } from '../auth-form/auth-form.component';

@Component({
  selector: 'app-user-survey',
  templateUrl: './user-survey.component.html',
  styleUrls: ['./user-survey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSurveyComponent {
  form = new FormGroup({
    first_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    last_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    phone: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  @ViewChild('authForm') authForm?: AuthFormComponent;

  constructor(
    public auth: AuthService,
    public http: HttpClient,
    protected router: Router,
    public companyService: CompanyService,
  ) {}

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.authForm?.startLoading();
    this.http
      .post(`${environment.apiUrl}/api/v1/user/pass-survey`, this.form.value)
      .subscribe({
        next: () => {
          this.authForm?.endLoading('success');
          this.auth.getUserInfo().subscribe((user) => {
            if (user.is_active) {
              if (this.companyService.companies.length > 0) {
                this.router.navigate(['/dashboard']);
              } else {
                this.router.navigate(['/company-survey']);
              }
            }
          });
        },
        error: (err) => {
          this.authForm?.processError(err);
        },
      });
  }
}
