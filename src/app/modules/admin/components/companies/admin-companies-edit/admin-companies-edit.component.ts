import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EditComponentComponent } from '../../../../base-module/components/edit-component/edit-component.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminCompany, AdminCompanyResponse } from '../../../types/companies';
import { environment } from '../../../../../../environments/environment';
import { AdminUser, AdminUserResponse } from '../../../types/users';

type AdminCompaniesFormGroup = {
  name: FormControl<string>;
  employees_number: FormControl<string>;
  website: FormControl<string>;
  owner_id: FormControl<string | null>;
  user_ids: FormControl<string[]>;
};

@Component({
  selector: 'app-admin-companies-edit',
  templateUrl: './admin-companies-edit.component.html',
  styleUrls: ['./admin-companies-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCompaniesEditComponent
  extends EditComponentComponent<AdminCompanyResponse, AdminCompany>
  implements OnInit
{
  override form = new FormGroup<AdminCompaniesFormGroup>({
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
    owner_id: new FormControl<string | null>(null, {
      nonNullable: true,
    }),
    user_ids: new FormControl<string[]>([], {
      nonNullable: true,
    }),
  });

  users: AdminUser[] = [];

  toDto(value: AdminCompanyResponse): AdminCompany {
    return value;
  }

  updateFormView(item: AdminCompany): void {
    this.form.controls.name.setValue(item.name);
    this.form.controls.employees_number.setValue(item.employees_number);
    this.form.controls.website.setValue(item.website);
    this.form.controls.owner_id.setValue(item.owner_name?.id ?? '');
    this.form.controls.user_ids.setValue(
      item.user_names?.map((item) => item.id) ?? [],
    );
  }

  override ngOnInit() {
    super.ngOnInit();

    this.fetchUserNames();
  }

  fetchUserNames() {
    this.http
      .post(`${environment.apiUrl}/api/v1/admin/users/read/`, {})
      .subscribe({
        next: (response) => {
          const data = response as AdminUserResponse[];
          this.users = data as AdminUser[];
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.editFormComponent.processError(err);
          this.cdr.markForCheck();
        },
      });
  }
}
