import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../../base-module/components/edit-component/edit-component.component';
import { AdminUser, AdminUserResponse } from '../../../types/users';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { AdminCompany, AdminCompanyResponse } from '../../../types/companies';
import { AdminUsersService } from '../../../services/admin-users.service';
import { ActivatedRoute } from '@angular/router';

type AdminUsersFormGroup = {
  first_name: FormControl<string>;
  last_name: FormControl<string>;
  phone: FormControl<string>;
  company_ids: FormControl<string[]>;
  company_id?: FormControl<string>;
  email?: FormControl<string>;
};

@Component({
  selector: 'app-admin-users-edit',
  templateUrl: './admin-users-edit.component.html',
  styleUrls: ['./admin-users-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersEditComponent
  extends EditComponentComponent<AdminUserResponse, AdminUser>
  implements OnInit
{
  override form = new FormGroup<AdminUsersFormGroup>({
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
    company_ids: new FormControl<string[]>([], {
      nonNullable: true,
    }),
  });

  companyControl = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true,
  });
  userEmailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });

  companies: AdminCompany[] = [];

  constructor(
    service: AdminUsersService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
  ) {
    super(service, deps, cdr, route);
  }

  toDto(value: AdminUserResponse): AdminUser {
    return value;
  }

  updateFormView(item: AdminUser): void {
    this.form.controls.first_name.setValue(item.first_name ?? '');
    this.form.controls.last_name.setValue(item.last_name ?? '');
    this.form.controls.phone.setValue(item.phone ?? '');
    this.form.controls.company_ids.setValue(
      item.company_names.map((item) => item.id) ?? [],
    );
  }

  override ngOnInit() {
    super.ngOnInit();

    this.fetchCompanyNames();

    if (this.type === 'create') {
      this.form.addControl('company_id', this.companyControl);
      this.form.addControl('email', this.userEmailControl);
      this.cdr.markForCheck();
    }
  }

  fetchCompanyNames() {
    this.deps.http
      .post(`${environment.apiUrl}/api/v1/admin/companies/read/`, {})
      .subscribe({
        next: (response) => {
          const data = response as AdminCompanyResponse[];
          this.companies = data as AdminCompany[];
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.editFormComponent.processError(err);
          this.cdr.markForCheck();
        },
      });
  }
}
