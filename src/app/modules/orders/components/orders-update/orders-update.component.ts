import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  OnInit,
  signal
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  EditComponentComponent,
  EditComponentDeps
} from "../../../base-module/components/edit-component/edit-component.component";
import { ActivatedRoute } from "@angular/router";
import {
  LoadingPointsStatus,
  LoadingPointsStatusArray,
  LoadingPointsTrailerType,
  LoadingPointsTrailerTypeArray,
  LoadingPointsType,
  LoadingPointsTypeArray,
  Order,
  OrderDocument,
  OrderDocumentType,
  OrderLoadingPoints, OrderLoadingType, OrderLoadingTypeArray,
  OrderResponse,
  OrderStatuses, OrderStatusesNames
} from "../../types/orders.type";
import { OrdersService } from "../../services/orders.service";
import { CustomersService } from "../../../customers/services/customers.service";
import { Nameable } from "../../../base-module/types/nameable.type";
import { environment } from "../../../../../environments/environment";
import { MatTableDataSource } from "@angular/material/table";
import { countries } from "countries-list";

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
}

interface OrderStatusSelection extends Nameable {
  disabled?: boolean;
}

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
    comments: new FormControl<string>(''),
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
  loadingPointsStatus = LoadingPointsStatusArray;
  orderLoadingType = OrderLoadingTypeArray;

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
  }
  dataSource: MatTableDataSource<OrderLoadingPoints>;

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
    const first_loading_date = item.loading_points_info.find((point) => point.type === LoadingPointsType.Loading);
    const last_loading_date = item.loading_points_info.filter((point) => point.type === LoadingPointsType.Unloading).pop();
    this.form.controls.internal_order_id.setValue(item.internal_order_id);
    this.form.controls.first_loading_date.setValue(first_loading_date?.date ?? null);
    this.form.controls.last_uploading_date.setValue(last_loading_date?.date ?? null);
    this.form.controls.order_price.setValue(item.order_price);
    this.form.controls.disponent_id.setValue(item.disponent_id);
    this.form.controls.delivery_responsible_id.setValue(
      item.delivery_responsible_id,
    );
    this.form.controls.truck_number.setValue(item.truck_number ?? null);
    this.form.controls.trailer_number.setValue(item.trailer_number ?? null);
    this.form.controls.loading_address.setValue(item.loading_address ?? null);
    this.form.controls.unloading_address.setValue(
      item.unloading_address ?? null,
    );
    this.form.controls.status.setValue(item.status.id);
    this.form.controls.loading_type.setValue(item.loading_type ?? null);
    this.form.controls.pallets.setValue(item.cargo_type ?? null);
    this.form.controls.cargo_type.setValue(item.cargo_type ?? null);
    this.form.controls.trailer_type.setValue(item.trailer_type ?? null);
    this.status.set(item.status.id);
    this.dataSource = new MatTableDataSource<OrderLoadingPoints>(
      item.loading_points_info || [],
    );
    console.log(this.form.controls.status.value);
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
    [item?.order_file, item?.pallets_file, item?.cmr_file, item?.invoice_file]
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

  editLoadingPoint(item: any) {
    this.edit = true;
    this.LoadingPointsForm.controls.type.setValue(item.type);
    this.LoadingPointsForm.controls.nation.setValue(item.nation);
    this.LoadingPointsForm.controls.zip_code.setValue(item.zip_code);
    this.LoadingPointsForm.controls.city.setValue(item.city);
    this.LoadingPointsForm.controls.address.setValue(item.address);
    this.LoadingPointsForm.controls.company_name.setValue(item.company_name);
    this.LoadingPointsForm.controls.date.setValue(item.date);
    this.LoadingPointsForm.controls.trailer_type.setValue(item.trailer_type);
    this.LoadingPointsForm.controls.adr.setValue(item.adr);
    this.LoadingPointsForm.controls.pallets.setValue(item.pallets);
    this.LoadingPointsForm.controls.temperature.setValue(item.temperature);
    this.LoadingPointsForm.controls.temperature_value.setValue(item.temperature_value);
    this.LoadingPointsForm.controls.weight.setValue(item.weight);
    this.selectedLoadingPoint = item;
  }

  sendEditLoadingPoint() {
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
    if (!this.LoadingPointsForm.valid) {
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
          const order = response as Order;
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

  protected readonly LoadingPointsStatusArray = LoadingPointsStatusArray;
  protected readonly LoadingPointsStatus = LoadingPointsStatus;
  protected readonly LoadingPointsType = LoadingPointsType;
  protected readonly OrderStatuses = OrderStatuses;
}
