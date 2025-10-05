import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  Injectable,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../services/company.service';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BaseModuleService } from '../../services/base-module-service';

@Injectable()
export class EditComponentDeps {
  constructor(
    public http: HttpClient,
    public companyService: CompanyService,
    public router: Router,
  ) {}
}

@Component({
  standalone: false,
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
    protected service: BaseModuleService<B, F>,
    protected deps: EditComponentDeps,
    protected cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
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
        const extras = this.deps.router.getCurrentNavigation()?.extras;
        if (extras?.state && extras.state['item']) {
          this.item = extras.state['item'];
        }

        effect(
          () => {
            const item = this.item();
            if (item) {
              this.updateFormView(item);
              this.cdr.markForCheck();
            }
          },
          { allowSignalWrites: true },
        );
      }
    });
  }

  protected destroy$ = new EventEmitter<void>();

  type: 'create' | 'update' = 'create';
  @ViewChild('editFormComponent') editFormComponent!: EditFormComponent;

  form!: FormGroup;

  get item(): WritableSignal<F | undefined> {
    return this.service.item;
  }
  set item(item: F | undefined) {
    this.service.item.set(item);
  }

  get module() {
    return this.service.module;
  }
  set module(module) {
    this.service.module = module;
  }

  ngOnInit() {
    this.service.updated$.subscribe((data: string) => {
      this.service.processUpdate(data);
    });

    this.service.created$.subscribe((data: string) => {
      this.service.processCreate(data);
    });

    this.service.deleted$.subscribe((data: string) => {
      this.service.processDelete(data);
    });
  }

  ngAfterViewInit() {
    if (this.type === 'update') {
      if (!this.item()) {
        this.route.params.subscribe((params) => {
          if (!params['id']) {
            return;
          }

          this.fetchItem(params['id']);
        });
      }
    }
  }

  get toDto() {
    return this.service.toDto;
  }

  abstract updateFormView(item: F): void;

  fetchItem(id: number | string) {
    this.editFormComponent.startLoading();

    this.service.readOne(id).subscribe({
      next: (item) => {
        this.editFormComponent.endLoading('success');
        this.updateFormView(item);
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

      this.service.update(this.values).subscribe({
        next: (item) => {
          this.updateFormView(item);
          this.editFormComponent.endLoading('success');
          this.cdr.markForCheck();
          subscriber.next(item);
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
      this.service.create(values).subscribe({
        next: (item) => {
          this.toUpdatePage();
          subscriber.next(item);
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
    this.deps.router.navigateByUrl(`${this.module}/update/${this.item()?.id}`, {
      state: {
        item: this.item(),
      },
    });
  }

  submit() {
    if (this.type === 'create') {
      return this.create().pipe(
        map((result) => {
          return { result: !!result, action: 'create' };
        }),
      );
    } else {
      return this.update().pipe(
        map((result) => {
          return { result: !!result, action: 'update' };
        }),
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.emit();
    this.item = undefined;
  }

  protected get formValid(): boolean {
    const element = document.querySelector('.ng-invalid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected get values() {
    return this.form.value;
  }
}
