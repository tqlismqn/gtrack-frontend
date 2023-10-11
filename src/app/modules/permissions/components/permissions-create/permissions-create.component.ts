import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../services/company.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { Modules } from '../../../../constants/modules';
import { PermissionAccess } from '../../../../constants/permission-access';
import { ModulesService } from '../../../../services/modules.service';
import { Nameable } from '../../../base-module/types/nameable.type';

@Component({
  selector: 'app-permissions-create',
  templateUrl: './permissions-create.component.html',
  styleUrls: ['./permissions-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsCreateComponent implements OnInit {
  constructor(
    protected http: HttpClient,
    protected cdr: ChangeDetectorRef,
    protected companyService: CompanyService,
    protected modulesService: ModulesService,
  ) {}

  userNames: Nameable[] = [];

  form = new FormGroup({
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

  loading = false;

  ngOnInit() {
    this.companyService.getUserSelections().subscribe((users) => {
      this.userNames = users.map((item) => ({
        name: `(${item.id}) ${item.name}`,
        id: item.id,
      }));
    });
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.http
      .post(`${environment.apiUrl}/api/v1/permissions/create`, {
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
