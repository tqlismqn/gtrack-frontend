import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../base-module/components/edit-component/edit-component.component';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderResponse } from '../../types/orders.type';
import { OrdersService } from '../../services/orders.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { Customer } from '../../../customers/types/customers.type';
import { merge, startWith, takeUntil, tap } from 'rxjs';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Currencies } from '../../../../types/currencies';

interface OrdersEditForm {
  customer_id: FormControl<string>;
  vat_id: FormControl<string>;
  remark: FormControl<string>;
  currency: FormControl<Currencies>;
  credit_limit: FormControl<number | null>;
  available_limit: FormControl<number | null>;
  order_price: FormControl<number>;
}

type CustomerSelection = Pick<
  Customer,
  | 'id'
  | 'company_name'
  | 'internal_company_id'
  | 'vat_id'
  | 'remark'
  | 'total_available_credit_limit'
  | 'insurance_credit_limit'
>;

type CustomerSelections = CustomerSelection[];

@Component({
  selector: 'app-orders-create',
  templateUrl: './orders-create.component.html',
  styleUrls: ['./orders-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersCreateComponent
  extends EditComponentComponent<OrderResponse, Order>
  implements AfterViewInit, OnInit
{
  constructor(
    service: OrdersService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    protected customersService: CustomersService,
  ) {
    super(service, deps, cdr, route);
  }
  override form = new FormGroup<OrdersEditForm>({
    customer_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    vat_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    remark: new FormControl<string>('', {
      nonNullable: true,
    }),
    currency: new FormControl<Currencies>(Currencies.EUR, {
      nonNullable: true,
    }),
    credit_limit: new FormControl<number | null>(null),
    available_limit: new FormControl<number | null>(null),
    order_price: new FormControl<number>(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
  });

  get currencies() {
    return (
      this.deps.companyService.currencies?.map((currency: any) => {
        return currency.ID;
      }) ?? []
    );
  }

  get currency() {
    return this.form.controls.currency.value ?? Currencies.EUR;
  }

  @ViewChild('fileUploadComponent') fileUpload!: FileUploadComponent;
  fileError = false;

  updateFormView() {
    //
  }

  customers: CustomerSelections = [];
  customers$ = new EventEmitter<CustomerSelections>();

  override ngOnInit() {
    super.ngOnInit();
    merge(
      this.form.controls.customer_id.valueChanges,
      this.form.controls.currency.valueChanges,
      this.customers$,
    )
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          const customer = this.customers.find(
            (item) => item.id === this.form.controls.customer_id.value,
          );
          this.form.controls.vat_id.setValue(customer?.vat_id ?? '');
          this.form.controls.remark.setValue(customer?.remark ?? '');
          const limits = this.calculateLimits(customer);
          this.form.controls.credit_limit.setValue(limits.credit_limit);
          this.form.controls.available_limit.setValue(limits.available_limit);
          this.cdr.markForCheck();
        }),
      )
      .subscribe();

    merge(
      this.deps.companyService.companyChanged$,
      this.deps.companyService.companiesUpdated$,
    )
      .pipe(
        startWith(undefined),
        takeUntil(this.destroy$),
        tap(() => {
          this.cdr.markForCheck();
        }),
      )
      .subscribe();
  }


  protected calculateLimits(customer?: CustomerSelection) {
    return {
      credit_limit: customer?.insurance_credit_limit
        ? this.deps.companyService.fromEur(
          this.currency,
          customer.insurance_credit_limit,
        )
        : null,

      available_limit: customer?.total_available_credit_limit
        ? this.deps.companyService.fromEur(
          this.currency,
          customer.total_available_credit_limit,
        )
        : null,
    };
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.editFormComponent.startLoading();

    merge(
      this.customersService.created$,
      this.customersService.deleted$,
      this.customersService.updated$,
    )
      .pipe(
        takeUntil(this.destroy$),
        startWith(undefined),
        tap(() => {
          this.customersService
            .read(
              {
                company_id: this.deps.companyService.selectedCompany?.id,
                select: [
                  'id',
                  'company_name',
                  'internal_company_id',
                  'vat_id',
                  'remark',
                  'total_available_credit_limit',
                  'insurance_credit_limit',
                ] as (keyof CustomerSelection)[],
              },
              false,
            )
            .subscribe({
              next: ([data]) => {
                this.editFormComponent.endLoading('success');
                this.customers = data as CustomerSelections;
                this.customers$.emit(this.customers);
                this.cdr.markForCheck();
              },
              error: (err) => {
                this.editFormComponent.processError(err);
              },
            });
        }),
      )
      .subscribe();
  }

  protected override get values(): any {
    const formData = new FormData();
    formData.append('customer_id', this.form.controls.customer_id.value);
    formData.append('currency', this.form.controls.currency.value);
    formData.append(
      'order_price',
      String(this.form.controls.order_price.value),
    );
    formData.append(
      'rate',
      String(this.deps.companyService.getRate(this.currency)),
    );
    if (this.fileUpload.files) {
      formData.append('order_file', this.fileUpload.files[0]);
    }
    formData.append(
      'price_eur',
      String(
        this.deps.companyService.toEur(
          this.currency,
          this.form.controls.order_price.value,
        ),
      ),
    )

    return formData;
  }

  protected override get formValid(): boolean {
    let result = super.formValid;
    if (!this.fileUpload.files || this.fileUpload.files.length === 0) {
      result = false;
      this.fileError = true;
    } else {
      this.fileError = false;
    }

    return result;
  }

  protected onFilesChange(files: FileList | null) {
    if (files && files.length > 0) {
      this.fileError = false;
      this.cdr.markForCheck();
    }
  }
}
