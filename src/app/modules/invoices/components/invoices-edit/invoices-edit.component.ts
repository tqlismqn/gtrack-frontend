import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../base-module/components/edit-component/edit-component.component';
import { ActivatedRoute } from '@angular/router';
import { InvoicesService } from '../../services/invoices.service';
import {
  CustomerFields,
  Invoice,
  InvoiceItem,
  InvoiceResponse,
  OrderFields,
} from '../../types/invoices.type';
import {
  CustomerBankForm,
  CustomersBankCollectionComponent,
} from '../../../customers/components/customers-bank-collection/customers-bank-collection.component';
import { CustomerBank } from '../../../customers/types/customers.type';
import { BankCollectionService } from '../../../../services/bank-collection.service';
import { startWith, takeUntil, tap } from 'rxjs';
import { merge } from 'rxjs';
import { Order } from '../../../orders/types/orders.type';
import {
  termsOfPayment,
  TermsOfPaymentEnum,
} from '../../../customers/types/terms-of-payment.enum';

interface InvoicesEditForm {
  order_id: FormControl<string | null>;
  vat_id: FormControl<string>;
  contact_phone: FormControl<string>;
  contact_email: FormControl<string>;
  accounting_email: FormControl<string>;
  customer_id: FormControl<string | null>;
  first_loading_date: FormControl<string>;
  last_uploading_date: FormControl<string>;
  pick_order_date: FormControl<string>;
  invoice_issued_date: FormControl<string>;
  terms_of_payment: FormControl<number>;
  currency: FormControl<string>;
  course: FormControl<number>;
  remark: FormControl<string>;
  internal_invoice_id: FormControl<string>;

  client_id: FormControl<number | null>;
}

interface InvoicesItemFormControl {
  description: FormControl<string>;
  quantity: FormControl<number>;
  price_per_item: FormControl<number>;
  price_vat: FormControl<number>;
  price: FormControl<number>;
}

@Component({
  selector: 'app-customers-edit',
  templateUrl: './invoices-edit.component.html',
  styleUrls: ['./invoices-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesEditComponent
  extends EditComponentComponent<InvoiceResponse, Invoice>
  implements OnInit, AfterViewInit
{
  constructor(
    protected override service: InvoicesService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    protected bankCollectionService: BankCollectionService,
  ) {
    super(service, deps, cdr, route);
    const extras = this.deps.router.getCurrentNavigation()?.extras;
    if (extras?.state && extras.state['order']) {
      const order = extras.state['order'] as Order;
      this.form.controls.order_id.setValue(order.id);
      this.updateOrderView(order);
      this.form.controls.customer_id.setValue(null);
      this.form.controls.client_id.disable();
      this.cdr.markForCheck();
    }
  }
  override form = new FormGroup<InvoicesEditForm>({
    internal_invoice_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    order_id: new FormControl(null),
    vat_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    contact_phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    contact_email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    accounting_email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    customer_id: new FormControl(null),
    first_loading_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    last_uploading_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    pick_order_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    invoice_issued_date: new FormControl(new Date().toISOString(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    terms_of_payment: new FormControl(TermsOfPaymentEnum.PREPAYMENT, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    currency: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    course: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    remark: new FormControl('', {
      nonNullable: true,
    }),
    client_id: new FormControl(null, {
      nonNullable: false,
    }),
  });

  get currencies() {
    return this.deps.companyService.currencies ?? [];
  }

  updateFormView(item: Invoice) {
    const controls = this.form.controls;
    controls.order_id?.setValue(item.order_id ?? null);
    controls.first_loading_date?.setValue(item.first_loading_date);
    controls.last_uploading_date?.setValue(item.last_uploading_date);
    controls.pick_order_date?.setValue(item.pick_order_date);
    controls.invoice_issued_date?.setValue(item.invoice_issued_date);
    controls.terms_of_payment?.setValue(item.terms_of_payment);
    controls.currency?.setValue(item.currency);
    controls.course?.setValue(item.course);
    controls.remark?.setValue(item.remark);
    controls.internal_invoice_id?.setValue(String(item.internal_invoice_id));

    controls.vat_id?.setValue(item.vat_id);
    controls.contact_phone?.setValue(item.contact_phone);
    controls.contact_email?.setValue(item.contact_email);
    controls.accounting_email?.setValue(item.accounting_email);

    if (item.items) {
      this.items = item.items;
    }

    if (item.bank) {
      this.updateBankView(item.bank);
    }

    if (item.customer) {
      controls.client_id?.setValue(item.customer.internal_company_id);
      controls.order_id.disable();
      controls.client_id.enable();
    }

    if (item.order && item.order.customer) {
      controls.client_id?.setValue(item.order.customer.internal_company_id);
      controls.order_id.enable();
      controls.client_id.disable();
    }

    this.cdr.markForCheck();
  }

  updateOrderView(item: OrderFields) {
    const controls = this.form.controls;
    controls.first_loading_date?.setValue(item.first_loading_date);
    controls.last_uploading_date?.setValue(item.last_uploading_date);
    controls.pick_order_date?.setValue(item.created_at.toISOString());
    this.cdr.markForCheck();

    if (item.customer) {
      this.updateCustomerView(item.customer);
    }
  }

  updateCustomerView(item: CustomerFields) {
    const controls = this.form.controls;
    controls.vat_id?.setValue(item.vat_id);
    controls.contact_phone?.setValue(item.contact_phone);
    controls.contact_email?.setValue(item.contact_email);
    controls.accounting_email?.setValue(item.accounting_email);
    controls.client_id?.setValue(item.internal_company_id);
    controls.terms_of_payment?.setValue(item.terms_of_payment);
    this.cdr.markForCheck();
  }

  @ViewChild('bankCollectionComponent')
  bankCollectionComponent?: CustomersBankCollectionComponent;

  updateBankView(item: CustomerBank) {
    const controls = this.bankGroup.controls;
    controls.bank_template?.setValue(item.bank_template);
    controls.bic?.setValue(item.bic);
    controls.code?.setValue(item.code);
    controls.name?.setValue(item.name);
    controls.iban?.setValue(item.iban);
    controls.currency?.setValue(item.currency);
    this.bankCollectionComponent?.checkBankSelector();
    this.cdr.markForCheck();
  }

  getCompanyName(companyId: string) {
    return (
      this.deps.companyService.companies.find((item) => item.id === companyId)
        ?.name ??
      this.deps.companyService.selectedCompany?.name ??
      ''
    );
  }

  onOrderSelect(id?: string | null) {
    if (!id) {
      this.form.controls.client_id.enable();
      this.form.controls.client_id.setValue(null);
      return;
    }

    const order = this.service.orders.find((item) => item.id === id);
    if (order) {
      this.form.controls.customer_id.setValue(null);
      this.form.controls.client_id.disable();
      this.updateOrderView(order);
    }
  }

  onCustomerSelect(id?: number | null) {
    if (!id) {
      this.form.controls.customer_id.setValue(null);
      this.form.controls.order_id.enable();
      return;
    }

    const customer = this.service.customers.find(
      (item) => item.internal_company_id === id,
    );
    if (customer) {
      this.form.controls.order_id.setValue(null);
      this.form.controls.order_id.disable();
      this.form.controls.customer_id.setValue(customer.id);
      this.updateCustomerView(customer);
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.service.orders$
      .pipe(
        tap(() => {
          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.bankCollectionService.data$
      .pipe(
        tap(() => {
          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$),
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

    this.setItemsListeners();
  }

  bankGroup: FormGroup<CustomerBankForm> = new FormGroup<CustomerBankForm>({
    bank_template: new FormControl(
      { name: '', id: '', bic: '', code: '', address: '', city: '' },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    bic: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    currency: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    iban: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected override get formValid(): boolean {
    let result = super.formValid;
    this.bankGroup.markAllAsTouched();
    result &&= this.bankGroup.valid;
    this.cdr.markForCheck();
    return result;
  }

  protected override get values(): any {
    const values = super.values;
    delete values['internal_invoice_id'];

    return {
      ...super.values,
      bank: this.bankGroup.value,
      order_id: this.form.controls.order_id.value,
      customer_id: this.form.controls.customer_id.value,
    };
  }

  itemsGroup: FormGroup<InvoicesItemFormControl> =
    new FormGroup<InvoicesItemFormControl>({
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl(1, { nonNullable: true }),
      quantity: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.pattern(/^\d*$/)],
      }),
      price_per_item: new FormControl(1, { nonNullable: true }),
      price_vat: new FormControl(0, { nonNullable: true }),
    });

  items: InvoiceItem[] = [];

  setItemsListeners() {
    const controls = this.itemsGroup.controls;
    merge(controls.quantity.valueChanges, controls.price_per_item.valueChanges)
      .pipe(
        startWith(undefined),
        takeUntil(this.destroy$),
        tap(() => {
          this.updatePrices();
        }),
      )
      .subscribe();
  }

  protected updatePrices() {
    const controls = this.itemsGroup.controls;
    const price =
      Math.round(
        controls.quantity.value * controls.price_per_item.value * 100,
      ) / 100;
    controls.price.setValue(price);
    controls.price_vat.setValue(price);
  }

  addItem() {
    this.itemsGroup.markAllAsTouched();
    if (!this.item || !this.itemsGroup.valid) {
      return;
    }
    const controls = this.itemsGroup.controls;
    this.service
      .addItem(this.item.id, {
        price_per_item: controls.price_per_item.value,
        quantity: controls.quantity.value,
        description: controls.description.value,
      })
      .subscribe((item) => {
        this.items.push(item);
        this.items = [...this.items];
        this.itemsGroup.reset();
        this.cdr.markForCheck();
      });
  }

  get sumPrice(): number {
    return (
      Math.round(this.items.reduce((sum, item) => sum + item.price, 0) * 100) /
      100
    );
  }

  protected readonly termsOfPayment = Object.values(termsOfPayment);
}
