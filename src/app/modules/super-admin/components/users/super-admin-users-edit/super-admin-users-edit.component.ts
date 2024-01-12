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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { AdminCompany, AdminCompanyResponse } from '../../../types/companies';
import { ActivatedRoute } from '@angular/router';
import { SuperAdminUsersService } from '../../../services/super-admin-users.service';
import { SuperAdminUser, SuperAdminUserResponse } from '../../../types/users';

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
  templateUrl: './super-admin-users-edit.component.html',
  styleUrls: ['./super-admin-users-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperAdminUsersEditComponent
  extends EditComponentComponent<SuperAdminUserResponse, SuperAdminUser>
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
    service: SuperAdminUsersService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
  ) {
    super(service, deps, cdr, route);
  }

  updateFormView(item: SuperAdminUser): void {
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
      .post(`${environment.apiUrl}/api/v1/super_admin/companies/read/`, {})
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
