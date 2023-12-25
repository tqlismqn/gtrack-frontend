import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../../base-module/components/edit-component/edit-component.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Nameable } from '../../../../base-module/types/nameable.type';
import { Role, RoleResponse, Roles } from '../../../types/roles';
import { AdminRolesService } from '../../../services/admin-roles.service';

type AdminUsersFormGroup = {
  user_id: FormControl<string>;
  role: FormControl<string>;
};

@Component({
  selector: 'app-admin-users-edit',
  templateUrl: './admin-roles-edit.component.html',
  styleUrls: ['./admin-roles-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRolesEditComponent
  extends EditComponentComponent<RoleResponse, Role>
  implements OnInit
{
  override form = new FormGroup<AdminUsersFormGroup>({
    user_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    role: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  roles: Nameable[] = [
    {
      name: 'Admin',
      id: Roles.Admin,
    },
    {
      name: 'User',
      id: Roles.User,
    },
  ];

  constructor(
    service: AdminRolesService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
  ) {
    super(service, deps, cdr, route);
  }

  updateFormView(item: Role): void {
    this.form.controls.role.setValue(item.role ?? '');
    this.form.controls.user_id.setValue(item.user_id ?? '');
  }

  override ngOnInit() {
    super.ngOnInit();

    this.fetchUserNames();
  }

  userNames = signal<Nameable[]>([]);
  fetchUserNames() {
    this.deps.http
      .get(
        `${environment.apiUrl}/api/v1/companies/user-names?company_id=${this.service.companyId}`,
      )
      .subscribe((response) => {
        const data = response as Nameable[];
        this.userNames.set(data);
      });
  }
}
