import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CompanyService } from '../../../../services/company.service';

@Component({
  selector: 'app-customers-create',
  templateUrl: './customers-create.component.html',
  styleUrls: ['./customers-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersCreateComponent {
  constructor(
    protected http: HttpClient,
    protected cdr: ChangeDetectorRef,
    protected companyService: CompanyService,
  ) {}
  form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  loading = false;

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.http
      .post(`${environment.apiUrl}/api/v1/customers/create`, {
        values: this.form.value,
        company_id: this.companyService.selectedCompany?.id,
      })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
