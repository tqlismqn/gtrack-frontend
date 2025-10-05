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
import { ActivatedRoute } from '@angular/router';
import { AdminUser, AdminUserResponse } from '../../../types/users';
import { AdminUsersService } from '../../../services/admin-users.service';

type AdminUsersFormGroup = {
  first_name: FormControl<string>;
  last_name: FormControl<string>;
  phone: FormControl<string>;
  email?: FormControl<string>;
};

@Component({
  standalone: false,
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
  });

  userEmailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });

  constructor(
    service: AdminUsersService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
  ) {
    super(service, deps, cdr, route);
  }

  updateFormView(item: AdminUser): void {
    this.form.controls.first_name.setValue(item.first_name ?? '');
    this.form.controls.last_name.setValue(item.last_name ?? '');
    this.form.controls.phone.setValue(item.phone ?? '');
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.type === 'create') {
      this.form.addControl('email', this.userEmailControl);
      this.cdr.markForCheck();
    }
  }
}
