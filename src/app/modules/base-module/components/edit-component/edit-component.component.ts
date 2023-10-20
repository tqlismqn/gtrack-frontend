import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../services/company.service';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { AdminModules, Modules } from '../../../../constants/modules';
import { environment } from '../../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-component',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class EditComponentComponent<
    B extends { id: string },
    F extends { id: string },
  >
  implements AfterViewInit, OnInit, OnDestroy
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

  protected destroy$ = new EventEmitter<void>();

  type: 'create' | 'update' = 'create';
  @ViewChild('editFormComponent') editFormComponent!: EditFormComponent;

  item?: F;

  module!: Modules | AdminModules;

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
    return new Observable<F | undefined>((subscriber) => {
      if (!this.formValid) {
        subscriber.next(undefined);
        subscriber.complete();
        return;
      }

      this.editFormComponent.startLoading();

      this.http
        .patch(
          `${environment.apiUrl}/api/v1/${this.module}/update/${this.item?.id}`,
          {
            values: this.values,
            company_id: this.companyService.selectedCompany?.id,
          },
        )
        .subscribe({
          next: (response) => {
            const item = response as B;
            this.item = this.toDto(item);
            this.updateFormView(this.item);
            this.editFormComponent.endLoading('success');
            this.cdr.markForCheck();
            subscriber.next(this.item);
            subscriber.complete();
          },
          error: (err) => {
            this.editFormComponent.endLoading('error');
            this.editFormComponent.processError(err);
            this.cdr.markForCheck();
            subscriber.next(undefined);
            subscriber.complete();
          },
        });
    });
  }

  create(values: any = this.values) {
    return new Observable<F | undefined>((subscriber) => {
      if (!this.formValid) {
        subscriber.next(undefined);
        subscriber.complete();
        return;
      }

      this.editFormComponent.startLoading();

      this.http
        .post(`${environment.apiUrl}/api/v1/${this.module}/create`, {
          values,
          company_id: this.companyService.selectedCompany?.id,
        })
        .subscribe({
          next: (response) => {
            const item = response as B;
            this.item = this.toDto(item);
            this.toUpdatePage();
            subscriber.next(this.item);
            subscriber.complete();
          },
          error: (err) => {
            this.editFormComponent.endLoading('error');
            this.editFormComponent.processError(err);
            this.cdr.markForCheck();
            subscriber.next(undefined);
            subscriber.complete();
          },
        });
    });
  }

  toUpdatePage() {
    this.router.navigateByUrl(`${this.module}/update/${this.item?.id}`, {
      state: {
        item: this.item,
      },
    });
  }

  submit() {
    if (this.type === 'create') {
      this.create().subscribe();
    } else {
      this.update().subscribe();
    }
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  protected get formValid(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected get values() {
    return this.form.value;
  }
}
