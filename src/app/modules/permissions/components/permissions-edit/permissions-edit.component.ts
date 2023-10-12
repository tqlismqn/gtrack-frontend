import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../services/company.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Modules } from '../../../../constants/modules';
import { PermissionAccess } from '../../../../constants/permission-access';
import { ModulesService } from '../../../../services/modules.service';
import { Nameable } from '../../../base-module/types/nameable.type';
import { EditComponentComponent } from '../../../base-module/components/edit-component/edit-component.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PermissionModule,
  PermissionModuleResponse,
} from '../../types/permissions.type';
import { PermissionsUtils } from '../../utils/permissions-utils';

@Component({
  selector: 'app-permissions-create',
  templateUrl: './permissions-edit.component.html',
  styleUrls: ['./permissions-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsEditComponent
  extends EditComponentComponent<PermissionModuleResponse, PermissionModule>
  implements OnInit
{
  constructor(
    http: HttpClient,
    cdr: ChangeDetectorRef,
    companyService: CompanyService,
    route: ActivatedRoute,
    router: Router,
    protected modulesService: ModulesService,
  ) {
    super(http, cdr, companyService, route, router);
  }

  userNames: Nameable[] = [];

  override form = new FormGroup({
    module_id: new FormControl<Modules | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    user_id: new FormControl<number | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    read_access: new FormControl<PermissionAccess | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    write_access: new FormControl<PermissionAccess | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  override ngOnInit() {
    super.ngOnInit();
    this.companyService.getUserSelections().subscribe((users) => {
      this.userNames = users.map((item) => ({
        name: `(${item.id}) ${item.name}`,
        id: item.id,
      }));
      this.cdr.markForCheck();
    });
  }

  toDto = PermissionsUtils.permissionResponseToDTO;

  updateFormView(item: PermissionModule): void {
    this.form.controls.module_id.setValue(item.module_id);
    this.form.controls.user_id.setValue(item.user_id);
    this.form.controls.read_access.setValue(item.read_access);
    this.form.controls.write_access.setValue(item.write_access);
  }
}
