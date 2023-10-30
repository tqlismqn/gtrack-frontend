import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../base-module/components/edit-component/edit-component.component';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderResponse } from '../../types/orders.type';
import { OrdersService } from '../../services/orders.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { Nameable } from '../../../base-module/types/nameable.type';

interface OrdersEditForm {
  internal_order_id: FormControl<number>;
  first_loading_date: FormControl<string | null>;
  last_uploading_date: FormControl<string | null>;
  order_price: FormControl<string>;
  disponent_id: FormControl<string>;
  delivery_responsible_id: FormControl<string>;
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
    service: OrdersService,
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
    this.form.controls.order_price.setValue(
      `${item.order_price} ${this.getCurrencySign(item.currency)}`,
    );
    this.form.controls.disponent_id.setValue(item.disponent_id);
    this.form.controls.delivery_responsible_id.setValue(
      item.delivery_responsible_id,
    );
  }

  getCurrencySign(currency: string) {
    switch (currency) {
      case 'USD':
        return '$';
      default:
        return '€';
    }
  }

  protected override get values(): any {
    return {
      internal_order_id: this.form.controls.internal_order_id.value,
      first_loading_date: this.form.controls.first_loading_date.value,
      last_uploading_date: this.form.controls.last_uploading_date.value,
      disponent_id: this.form.controls.disponent_id.value,
      delivery_responsible_id: this.form.controls.delivery_responsible_id.value,
    };
  }
}
