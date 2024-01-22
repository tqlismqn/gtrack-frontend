import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../base-module/components/edit-component/edit-component.component';
import { ActivatedRoute } from '@angular/router';
import {
  Order,
  OrderDocument,
  OrderDocumentType,
  OrderResponse,
  OrderStatuses,
} from '../../types/orders.type';
import { OrdersService } from '../../services/orders.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { Nameable } from '../../../base-module/types/nameable.type';
import { environment } from '../../../../../environments/environment';

interface OrdersEditForm {
  internal_order_id: FormControl<number>;
  first_loading_date: FormControl<string | null>;
  last_uploading_date: FormControl<string | null>;
  order_price: FormControl<string>;
  disponent_id: FormControl<string>;
  delivery_responsible_id: FormControl<string>;
  truck_number: FormControl<string | null>;
  trailer_number: FormControl<string | null>;
  loading_address: FormControl<string | null>;
  unloading_address: FormControl<string | null>;
  status: FormControl<OrderStatuses>;
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
  constructor(
    protected override service: OrdersService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    protected customersService: CustomersService,
  ) {
    super(service, deps, cdr, route);
  }

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
    order_price: new FormControl<string>('', {
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
  }

  updateFormView(item: Order) {
    this.form.controls.internal_order_id.setValue(item.internal_order_id);
    this.form.controls.first_loading_date.setValue(item.first_loading_date);
    this.form.controls.last_uploading_date.setValue(item.last_uploading_date);
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
    this.status.set(item.status.id);
  }

  protected override get values(): any {
    const values = this.form.value;
    if (values.order_price) {
      delete values.order_price;
    }

    return values;
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
}
