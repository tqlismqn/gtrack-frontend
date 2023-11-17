import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { environment } from '../../../../../environments/environment';
import { Currencies, CurrenciesArray } from '../../../../types/currencies';

@Component({
  selector: 'app-company-survey',
  templateUrl: './company-survey.component.html',
  styleUrls: ['./company-survey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySurveyComponent {
  form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    employees_number: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    website: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    currencies: new FormControl<Currencies[]>([...CurrenciesArray], {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  currencies = [...CurrenciesArray];

  @ViewChild('authForm') authForm?: AuthFormComponent;

  constructor(
    public http: HttpClient,
    protected router: Router,
    protected companyService: CompanyService,
    protected auth: AuthService,
  ) {}

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.authForm?.startLoading();
    this.http
      .post(
        `${environment.apiUrl}/api/v1/companies/pass-survey`,
        this.form.value,
      )
      .subscribe({
        next: () => {
          this.authForm?.endLoading('success');
          this.companyService.fetch().subscribe(([companies]) => {
            if (!this.auth.user?.is_active) {
              this.router.navigate(['/user-survey']);
            } else if (companies.length > 0) {
              this.router.navigate(['/dashboard']);
            }
          });
        },
        error: (err) => {
          this.authForm?.processError(err);
        },
      });
  }
}
