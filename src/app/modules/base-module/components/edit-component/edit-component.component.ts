import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../services/company.service';
import { ModuleBase, ModuleBaseResponse } from '../../types/module-base.type';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { Modules } from '../../../../constants/modules';
import { environment } from '../../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-component',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class EditComponentComponent<
    B extends ModuleBaseResponse,
    F extends ModuleBase,
  >
  implements AfterViewInit, OnInit
{
  constructor(
    protected http: HttpClient,
    protected cdr: ChangeDetectorRef,
    protected companyService: CompanyService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
    this.route.data.subscribe((data) => {
      if (
        (data['type'] && data['type'] === 'create') ||
        data['type'] === 'update'
      ) {
        this.type = data['type'];
      }

      if (data['module']) {
        this.module = data['module'];
      }

      if (this.type === 'update') {
        const extras = this.router.getCurrentNavigation()?.extras;
        if (extras?.state && extras.state['item']) {
          this.item = extras.state['item'];
        }
      }
    });
  }

  type: 'create' | 'update' = 'create';
  @ViewChild('editFormComponent') editFormComponent!: EditFormComponent;

  item?: F;

  module!: Modules;

  form!: FormGroup;

  ngOnInit() {
    if (this.type === 'update' && this.item) {
      this.updateFormView(this.item);
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit() {
    if (this.type === 'update') {
      if (!this.item) {
        this.route.params.subscribe((params) => {
          if (!params['id']) {
            return;
          }

          this.fetchItem(params['id']);
        });
      }
    }
  }

  abstract toDto(value: B): F;

  abstract updateFormView(item: F): void;

  fetchItem(id: number | string) {
    this.editFormComponent.startLoading();

    this.http
      .get(
        `${environment.apiUrl}/api/v1/${this.module}/read/${id}?company_id=${this.companyService.selectedCompany?.id}`,
      )
      .subscribe({
        next: (response) => {
          const data = response as B;
          this.item = this.toDto(data);
          this.editFormComponent.endLoading('success');
          this.updateFormView(this.item);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.editFormComponent.endLoading('error');
          this.editFormComponent.processError(err);
          this.cdr.markForCheck();
        },
      });
  }

  update() {
    if (!this.form.valid || !this.item) {
      return;
    }

    this.editFormComponent.startLoading();

    this.http
      .patch(
        `${environment.apiUrl}/api/v1/${this.module}/update/${this.item?.id}`,
        {
          values: this.form.value,
          company_id: this.companyService.selectedCompany?.id,
        },
      )
      .subscribe({
        next: (response) => {
          this.editFormComponent.endLoading('success');
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.editFormComponent.endLoading('error');
          this.editFormComponent.processError(err);
          this.cdr.markForCheck();
        },
      });
  }

  create() {
    if (!this.form.valid) {
      return;
    }

    this.editFormComponent.startLoading();

    this.http
      .post(`${environment.apiUrl}/api/v1/${this.module}/create`, {
        values: this.form.value,
        company_id: this.companyService.selectedCompany?.id,
      })
      .subscribe({
        next: (response) => {
          this.editFormComponent.endLoading('success');
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.editFormComponent.endLoading('error');
          this.editFormComponent.processError(err);
          this.cdr.markForCheck();
        },
      });
  }

  submit() {
    if (this.type === 'create') {
      this.create();
    } else {
      this.update();
    }
  }
}
