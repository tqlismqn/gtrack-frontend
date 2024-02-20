import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../base-module/components/edit-component/edit-component.component';
import { ActivatedRoute } from '@angular/router';
import {
  LoadingPointsTrailerType,
  LoadingPointsTrailerTypeArray,
  LoadingPointsType,
  LoadingPointsTypeArray,
  Order,
  OrderDocument,
  OrderDocumentType,
  OrderLoadingPoints,
  OrderLoadingType,
  OrderLoadingTypeArray,
  OrderResponse,
  OrdersSelectStatus,
  OrdersSelectStatusArray,
  OrderStatuses,
  PaymentSelectStatus,
  PaymentSelectStatusArray,
  ReceviedSelectStatus,
  ReceviedSelectStatusArray,
  SelectStatus,
  SelectStatusArray
} from "../../types/orders.type";
import { OrdersService } from '../../services/orders.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { Nameable } from '../../../base-module/types/nameable.type';
import { environment } from '../../../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { countries } from 'countries-list';
import { Customer } from '../../../customers/types/customers.type';
import { merge, startWith, takeUntil, tap } from 'rxjs';

interface OrdersEditForm {
  internal_order_id: FormControl<number>;
  first_loading_date: FormControl<string | null>;
  last_uploading_date: FormControl<string | null>;
  order_price: FormControl<number>;
  disponent_id: FormControl<string>;
  delivery_responsible_id: FormControl<string>;
  truck_number: FormControl<string | null>;
  trailer_number: FormControl<string | null>;
  loading_address: FormControl<string | null>;
  unloading_address: FormControl<string | null>;
  status: FormControl<OrderStatuses>;
  cargo_type: FormControl<string | null>;
  pallets: FormControl<string | null>;
  loading_type: FormControl<OrderLoadingType[] | null>;
  trailer_type: FormControl<string | null>;
  change_status: FormControl<string | null>;
  cmr: FormControl<string | null>;
  customer_id: FormControl<string>;
  empty_km: FormControl<string | null>;
  total_km: FormControl<string | null>;
  carrier_price: FormControl<number | null>;
  client_reference: FormControl<string | null>;
  telax_invoice_status: FormControl<boolean | null>;
  telax_invoice_due_date: FormControl<string>;
  telax_invoice_days_left: FormControl<number>;
  tva: FormControl<boolean>;
  date_of_order_sale: FormControl<string | null>;
  carrier_invoice_status: FormControl<boolean | null>;
  carrier_invoice_nr: FormControl<string | null>;
  carrier_invoice_due_date: FormControl<string>;
  carrier_invoice_day_left: FormControl<number>;
  carrier_payment_status: FormControl<boolean | null>;
  selling_price: FormControl<number | null>;
  revenue: FormControl<number | null>;
  recommended_selling_price: FormControl<number | null>;
}

interface OrderStatusSelection extends Nameable {
  disabled?: boolean;
}

type CustomerSelection = Pick<
  Customer,
  'id' | 'company_name' | 'internal_company_id'
>;

type CustomerSelections = CustomerSelection[];
@Component({
  selector: 'app-orders-update',
  templateUrl: './orders-update.component.html',
  styleUrls: ['./orders-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersUpdateComponent
  extends EditComponentComponent<OrderResponse, Order>
  implements AfterViewInit, OnInit
{
  LoadingPointsForm = new FormGroup({
    type: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    nation: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    zip_code: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    city: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    address: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    company_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    date: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    trailer_type: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    adr: new FormControl<boolean | null>(null, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    pallets: new FormControl<boolean | null>(null, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    temperature: new FormControl<boolean | null>(null, {}),
    temperature_value: new FormControl<number>(0, {}),
    weight: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    loading_reference: new FormControl<string>('', {}),
    unloading_reference: new FormControl<string>('', {}),
    notes: new FormControl<string>(''),
    fixed_times: new FormControl<boolean>(false, {}),
    hours: new FormControl<string | null>(null, {}),
    minutes: new FormControl<string | null>(null, {}),
    period: new FormControl<string | null>('AM', {}),
  });
  constructor(
    protected override service: OrdersService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    protected customersService: CustomersService,
  ) {
    super(service, deps, cdr, route);
    this.dataSource = new MatTableDataSource<OrderLoadingPoints>([]);
  }

  loading = false;
  edit = false;
  selectedLoadingPoint!: OrderLoadingPoints;
  loadingPointsTypes = LoadingPointsTypeArray;
  loadingPointsTrailerTypes = LoadingPointsTrailerTypeArray;
  selectStatusArray = SelectStatusArray;
  orderLoadingType = OrderLoadingTypeArray;
  receviedSelectStatusArray = ReceviedSelectStatusArray;
  paymentSelectStatusArray = PaymentSelectStatusArray;
  changedStatus: boolean = false;
  customers: CustomerSelections = [];
  customers$ = new EventEmitter<CustomerSelections>();
  show_full_form: boolean = false;

  countries = Object.keys(countries);

  override form = new FormGroup<OrdersEditForm>({
    internal_order_id: new FormControl<number>(0, {
      nonNullable: true,
    }),
    first_loading_date: new FormControl<string | null>(
      new Date().toISOString(),
      {},
    ),
    last_uploading_date: new FormControl<string | null>(
      new Date().toISOString(),
      {},
    ),
    order_price: new FormControl<number>(0, {
      nonNullable: true,
    }),
    disponent_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    delivery_responsible_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    truck_number: new FormControl<string | null>(null),
    trailer_number: new FormControl<string | null>(null),
    loading_address: new FormControl<string | null>(null),
    unloading_address: new FormControl<string | null>(null),
    status: new FormControl<OrderStatuses>(OrderStatuses.DRAFT, {
      nonNullable: true,
    }),
    cargo_type: new FormControl<string | null>(null),
    pallets: new FormControl<string | null>(null),
    loading_type: new FormControl<OrderLoadingType[] | null>(null),
    trailer_type: new FormControl<string | null>(null),
    change_status: new FormControl<string | null>(null),
    cmr: new FormControl<string | null>(null),
    customer_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    empty_km: new FormControl<string | null>(''),
    total_km: new FormControl<string | null>(''),
    carrier_price: new FormControl<number | null>(0),
    client_reference: new FormControl<string | null>(''),
    telax_invoice_status: new FormControl<boolean | null>(false),
    telax_invoice_due_date: new FormControl<string>(new Date().toISOString(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    telax_invoice_days_left: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    tva: new FormControl<boolean>(false, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    date_of_order_sale: new FormControl<string | null>(
      new Date().toISOString(),
    ),
    carrier_invoice_status: new FormControl<boolean | null>(false),
    carrier_invoice_nr: new FormControl<string | null>(''),
    carrier_invoice_due_date: new FormControl<string>(
      new Date().toISOString(),
      {
        validators: [Validators.required],
        nonNullable: true,
      },
    ),
    carrier_invoice_day_left: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    carrier_payment_status: new FormControl<boolean | null>(false),
    selling_price: new FormControl<number | null>(0),
    revenue: new FormControl<number | null>(0),
    recommended_selling_price: new FormControl<number | null>(0),
  });

  status = signal<OrderStatuses>(OrderStatuses.DRAFT);
  statusSelections = computed<OrderStatusSelection[]>(() => {
    const selections = this.service.ordersSelections;
    let enabled: OrderStatuses;
    const status = this.status();
    switch (status) {
      case OrderStatuses.IN_PROGRESS:
        enabled = OrderStatuses.LOADED;
        break;

      case OrderStatuses.LOADED:
        enabled = OrderStatuses.UNLOADED;
        break;
    }

    return selections.map((item) => ({
      ...item,
      disabled: item.id !== enabled && item.id !== status,
    }));
  });

  users: Nameable[] = [];

  override ngOnInit() {
    super.ngOnInit();
    this.deps.companyService.getUserSelections().subscribe((users) => {
      this.users = users;
      this.cdr.markForCheck();
    });
    this.LoadingPointsForm.controls.trailer_type.valueChanges.subscribe(() => {
      if (
        this.LoadingPointsForm.controls.trailer_type.value !==
        LoadingPointsTrailerType.Frigo
      ) {
        this.LoadingPointsForm.controls.temperature.setValue(null);
      }
    });
    this.LoadingPointsForm.controls.temperature.valueChanges.subscribe(() => {
      if (!this.LoadingPointsForm.controls.temperature.value) {
        this.LoadingPointsForm.controls.temperature_value.setValue(null);
      }
    });
    this.LoadingPointsForm.controls.fixed_times.valueChanges.subscribe(() => {
      if (!this.LoadingPointsForm.controls.fixed_times.value) {
        this.LoadingPointsForm.controls.hours.setValue(null);
        this.LoadingPointsForm.controls.minutes.setValue(null);
        this.LoadingPointsForm.controls.period.setValue('AM');
      }
    });
    this.form.controls.telax_invoice_due_date.valueChanges.subscribe(() => {
      this.form.controls.telax_invoice_days_left.setValue(
        this.calculateDaysLeft(this.form.controls.telax_invoice_due_date.value),
      );
    });
    this.form.controls.carrier_invoice_due_date.valueChanges.subscribe(() => {
      this.form.controls.carrier_invoice_day_left.setValue(
        this.calculateDaysLeft(
          this.form.controls.carrier_invoice_due_date.value,
        ),
      );
    });
    this.form.controls.order_price.valueChanges.subscribe(() => {
      this.form.controls.revenue.setValue(
        this.calculateRevenue(),
      )
    });
    this.form.controls.selling_price.valueChanges.subscribe(() => {
      this.form.controls.revenue.setValue(
        this.calculateRevenue(),
      )
    });
  }
  dataSource: MatTableDataSource<OrderLoadingPoints>;

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

  displayedColumns = [
    'Type',
    'Nation',
    'Zip Code',
    'City',
    'Weight',
    'Date',
    'Edit',
    'Delete',
  ];

  updateFormView(item: Order) {
    let first_loading: OrderLoadingPoints | undefined;
    let last_loading: OrderLoadingPoints | undefined;
    if (item.loading_points_info) {
      first_loading = item.loading_points_info.find(
        (point) => point.type === LoadingPointsType.Loading,
      );
      last_loading = item.loading_points_info
        .filter((point) => point.type === LoadingPointsType.Unloading)
        .pop();
    }
    this.form.controls.internal_order_id.setValue(item.internal_order_id);
    this.form.controls.first_loading_date.setValue(
      first_loading?.date ?? item?.first_loading_date ?? null,
    );
    this.form.controls.last_uploading_date.setValue(
      last_loading?.date ?? item?.last_uploading_date ?? null,
    );
    this.form.controls.order_price.setValue(item.order_price);
    this.form.controls.disponent_id.setValue(item.disponent_id);
    this.form.controls.delivery_responsible_id.setValue(
      item.delivery_responsible_id,
    );
    this.form.controls.truck_number.setValue(item.truck_number ?? null);
    this.form.controls.trailer_number.setValue(item.trailer_number ?? null);
    this.form.controls.loading_address.setValue(first_loading?.address ?? null);
    this.form.controls.unloading_address.setValue(
      last_loading?.address ?? null,
    );
    this.form.controls.status.setValue(item.status.id);
    this.form.controls.loading_type.setValue(item.loading_type ?? null);
    this.form.controls.pallets.setValue(item.cargo_type ?? null);
    this.form.controls.cargo_type.setValue(item.cargo_type ?? null);
    this.form.controls.trailer_type.setValue(item.trailer_type ?? null);
    this.form.controls.change_status.setValue(item.change_status ?? null);
    this.form.controls.cmr.setValue(item.cmr ?? null);
    this.form.controls.customer_id.setValue(item.customer_id);
    this.form.controls.empty_km.setValue(item.empty_km ?? null);
    this.form.controls.total_km.setValue(item.total_km ?? null);
    this.form.controls.carrier_price.setValue(item.carrier_price ?? null);
    this.form.controls.client_reference.setValue(item.client_reference ?? null);
    this.form.controls.telax_invoice_status.setValue(
      item.telax_invoice_status ?? false,
    );
    this.form.controls.telax_invoice_due_date.setValue(
      item.telax_invoice_due_date,
    );
    this.form.controls.telax_invoice_days_left.setValue(
      item.telax_invoice_days_left ??
        this.calculateDaysLeft(this.form.controls.telax_invoice_due_date.value),
    );
    this.form.controls.tva.setValue(item.tva ?? false);
    this.form.controls.date_of_order_sale.setValue(
      item.date_of_order_sale ?? null,
    );
    this.form.controls.carrier_invoice_status.setValue(
      item.carrier_invoice_status ?? false,
    );
    this.form.controls.carrier_invoice_nr.setValue(
      item.carrier_invoice_nr ?? null,
    );
    this.form.controls.carrier_invoice_due_date.setValue(
      item.carrier_invoice_due_date,
    );
    this.form.controls.carrier_invoice_day_left.setValue(
      item.carrier_invoice_day_left ??
        this.calculateDaysLeft(
          this.form.controls.carrier_invoice_due_date.value,
        ),
    );
    this.form.controls.carrier_payment_status.setValue(item.carrier_payment_status ?? false);
    this.form.controls.selling_price.setValue(item.selling_price ?? null);
    this.form.controls.revenue.setValue(item.revenue ?? this.calculateRevenue());
    this.form.controls.recommended_selling_price.setValue(item.recommended_selling_price ?? null);
    this.status.set(item.status.id);
    this.dataSource = new MatTableDataSource<OrderLoadingPoints>(
      item.loading_points_info || [],
    );
  }

  calculateDaysLeft(date: string) {
    const currentDate = new Date();
    const diffTime = new Date(date).getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateRevenue() {
    return this.form.controls.order_price.value - (this.form.controls.selling_price.value ?? 0);
  }

  orderChangeStatus() {
    if (
      [OrderStatuses.LOADED, OrderStatuses.UNLOADED].includes(
        this.form.controls.status.value,
      )
    ) {
      this.changedStatus = true;
      this.form.controls.change_status.setValue(null);
      return;
    }
    this.changedStatus = false;
  }

  protected override get values(): any {
    return this.form.value;
  }

  public onFileChange(type: OrderDocumentType, files?: FileList | null) {
    if (files && files[0]) {
      this.uploadDocument(type, files[0]);
    }
  }

  protected uploadDocument(type: OrderDocumentType, file: File) {
    const formData = new FormData();
    formData.append(type, file);

    this.deps.http
      .post(
        `${environment.apiUrl}/api/v1/${this.module}/upload/create/${this.item()
          ?.id}?company_id=${this.deps.companyService.selectedCompany?.id}`,
        formData,
      )
      .subscribe({
        next: (response) => {
          const data = response as OrderDocument;
          this.service.item.update((item) => {
            if (item) {
              item[type] = data;
            }
            return item;
          });
          this.cdr.markForCheck();

          const item = this.item();

          if (item) {
            this.fetchItem(item.id);
          }
        },
      });
  }

  downloadAll() {
    const item = this.item();
    [
      item?.order_file,
      item?.pallets_file,
      item?.cmr_file,
      item?.invoice_file,
      item?.change_status_file,
    ]
      .filter((item) => !!item)
      .forEach((item) => this.downloadDoc(item as OrderDocument));
  }

  downloadDoc(doc: OrderDocument) {
    this.deps.http
      .get(
        `${environment.apiUrl}/api/v1/${this.module}/download/${this.item()
          ?.id}?company_id=${this.deps.companyService.selectedCompany?.id}&id=${
          doc.id
        }`,
        { responseType: 'blob' },
      )
      .subscribe((response) => {
        const blob = new Blob([response as BlobPart], {
          type: 'application/octet-stream',
        });

        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = doc.name;
        a.click();
        a.remove();
      });
  }

  get validLoadingPoints() {
    let result = true;
    if (!this.LoadingPointsForm.valid) {
      result = false;
    }
    if (
      this.dataSource.data.find(
        (point) => point.type === this.LoadingPointsForm.controls.type.value,
      ) &&
      !this.edit
    ) {
      result = false;
    }

    if (
      this.LoadingPointsForm.controls.type.value ===
        LoadingPointsType.Loading &&
      this.LoadingPointsForm.controls.loading_reference.value === ''
    ) {
      this.LoadingPointsForm.controls.loading_reference.setErrors({
        required: true,
      });
      result = false;
    }

    if (
      this.LoadingPointsForm.controls.type.value ===
        LoadingPointsType.Unloading &&
      this.LoadingPointsForm.controls.unloading_reference.value === ''
    ) {
      this.LoadingPointsForm.controls.unloading_reference.setErrors({
        required: true,
      });
      result = false;
    }

    if (
      this.LoadingPointsForm.controls.fixed_times.value &&
      this.LoadingPointsForm.controls.hours.value === null
    ) {
      this.LoadingPointsForm.controls.hours.setErrors({ required: true });
      result = false;
    }
    if (
      this.LoadingPointsForm.controls.fixed_times.value &&
      this.LoadingPointsForm.controls.minutes.value === null
    ) {
      this.LoadingPointsForm.controls.minutes.setErrors({ required: true });
      result = false;
    }
    if (
      this.LoadingPointsForm.controls.fixed_times.value &&
      this.LoadingPointsForm.controls.period.value === null
    ) {
      this.LoadingPointsForm.controls.period.setErrors({ required: true });
      result = false;
    }

    return result;
  }

  editLoadingPoint(item: any) {
    this.edit = true;
    this.LoadingPointsForm.controls.type.setValue(item.type);
    this.LoadingPointsForm.controls.nation.setValue(item.nation);
    this.LoadingPointsForm.controls.zip_code.setValue(item.zip_code);
    this.LoadingPointsForm.controls.city.setValue(item.city);
    this.LoadingPointsForm.controls.address.setValue(item.address);
    this.LoadingPointsForm.controls.company_name.setValue(item.company_name);
    this.LoadingPointsForm.controls.date.setValue(item.date);
    this.LoadingPointsForm.controls.fixed_times.setValue(item.fixed_times);
    this.LoadingPointsForm.controls.hours.setValue(item.hours);
    this.LoadingPointsForm.controls.minutes.setValue(item.minutes);
    this.LoadingPointsForm.controls.period.setValue(item.period);
    this.LoadingPointsForm.controls.trailer_type.setValue(item.trailer_type);
    this.LoadingPointsForm.controls.adr.setValue(item.adr);
    this.LoadingPointsForm.controls.pallets.setValue(item.pallets);
    this.LoadingPointsForm.controls.temperature.setValue(item.temperature);
    this.LoadingPointsForm.controls.temperature_value.setValue(
      item.temperature_value,
    );
    this.LoadingPointsForm.controls.weight.setValue(item.weight);
    this.LoadingPointsForm.controls.loading_reference.setValue(
      item.loading_reference,
    );
    this.LoadingPointsForm.controls.unloading_reference.setValue(
      item.unloading_reference,
    );
    this.LoadingPointsForm.controls.notes.setValue(item.notes);
    this.selectedLoadingPoint = item;
  }

  sendEditLoadingPoint() {
    if (!this.validLoadingPoints) {
      return;
    }
    const index = this.dataSource.data.findIndex(
      (point) => point === this.selectedLoadingPoint,
    );
    const point: any = this.LoadingPointsForm.value;
    if (index >= 0) {
      this.dataSource.data.splice(index, 1, point);
    }
    this.updateLoadingPoints(this.dataSource.data);
    this.LoadingPointsForm.reset();
  }
  deleteLoadingPoint(item: OrderLoadingPoints) {
    const index = this.dataSource.data.findIndex((point) => point === item);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
    }
    this.updateLoadingPoints(this.dataSource.data);
  }

  loadingPointsSubmit() {
    if (!this.validLoadingPoints) {
      return;
    }
    const data = [...this.dataSource.data, this.LoadingPointsForm.value];
    this.updateLoadingPoints(data);
  }

  updateLoadingPoints(data: any) {
    this.loading = true;
    this.edit = false;
    this.cdr.markForCheck();
    this.deps.http
      .patch(
        `${environment.apiUrl}/api/v1/${this.module}/update/${this.item()
          ?.id}?company_id=${this.deps.companyService.selectedCompany?.id}`,
        {
          loading_points_info: data,
        },
      )
      .subscribe({
        next: (response) => {
          const orderResponse = response as OrderResponse;
          const order = this.service.toDto(orderResponse);
          this.loading = false;
          this.cdr.markForCheck();
          this.updateFormView(order);
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
          throw err;
        },
      });
  }
  protected readonly LoadingPointsType = LoadingPointsType;
  protected readonly OrderStatuses = OrderStatuses;
  protected readonly OrdersSelectStatusArray = OrdersSelectStatusArray;
  protected readonly OrdersSelectStatus = OrdersSelectStatus;
  protected readonly SelectStatus = SelectStatus;
  protected readonly ReceviedSelectStatus = ReceviedSelectStatus;
  protected readonly PaymentSelectStatus = PaymentSelectStatus;
}
