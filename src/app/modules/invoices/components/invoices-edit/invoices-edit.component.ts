import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
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
import {
  Customer,
  CustomerBank,
} from '../../../customers/types/customers.type';
import { BankCollectionService } from '../../../../services/bank-collection.service';
import { Observable, ReplaySubject, startWith, takeUntil, tap } from 'rxjs';
import { merge } from 'rxjs';
import { Order } from '../../../orders/types/orders.type';
import {
  termsOfPayment,
  TermsOfPaymentEnum,
} from '../../../customers/types/terms-of-payment.enum';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { defaultSearchableFields } from '../../../base-module/constants/default-searchable-fields';
import { Selectable } from '../../../../types/selectable.type';
import { PaginationType } from '../../../base-module/types/pagination.type';
import { ModuleBaseReadRequest } from '../../../base-module/types/module-base.type';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
  paid_sum: FormControl<number | null>;

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
  @ViewChild('ConfirmDialogComponent', { static: true })
  ConfirmDialogComponent?: TemplateRef<any>;

  @ViewChild('clientID') clientID?: MatSelect;

  @ViewChildren(CustomersBankCollectionComponent)
  bankCollectionComponents: QueryList<CustomersBankCollectionComponent> =
    new QueryList<CustomersBankCollectionComponent>();

  @ViewChild('clientPaginator')
  clientPaginator!: MatPaginator;

  @ViewChild('orderPaginator')
  orderPaginator!: MatPaginator;

  constructor(
    override service: InvoicesService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    protected bankCollectionService: BankCollectionService,
    protected snackBar: MatSnackBar,
    protected dialog: MatDialog,
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
    paid_sum: new FormControl<number | null>(null, {
      nonNullable: false,
    }),
  });

  protected readonly termsOfPayment = Object.values(termsOfPayment);

  invoiceItems?: [InvoiceItem];

  bankForms: FormGroup<CustomerBankForm>[] = [];

  clients: Customer[] = [];
  orders: Order[] = [];

  clientFilterControl = new FormControl<string>('');
  searchingClientFieldControl = new FormControl<string>('internal_company_id');
  orderFilterControl = new FormControl<string>('');
  searchingOrderFieldControl = new FormControl<string>('internal_order_id');

  searchableClientColumns: Selectable[] = [
    {
      name: 'ID',
      value: 'internal_company_id',
    },
    {
      name: 'Company name',
      value: 'company_name',
    },
  ];

  searchableOrderColumns: Selectable[] = [
    {
      name: 'ID',
      value: 'internal_order_id',
    },
  ];

  clientPagination: PaginationType = {
    page: 1,
    limit: 5,
  };

  orderPagination: PaginationType = {
    page: 1,
    limit: 5,
  };

  get currencies() {
    return (
      this.deps.companyService.currencies?.map((currency: any) => {
        return currency.ID;
      }) ?? []
    );
  }

  get firstBank(): FormGroup<CustomerBankForm> | undefined {
    return this.bankForms[0];
  }

  get otherBanks(): FormGroup<CustomerBankForm>[] | undefined {
    return this.bankForms.slice(1);
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
    controls.paid_sum?.setValue(item.paid_sum);

    if (item.items) {
      this.items = item.items;
    }

    if (item.bank) {
      this.updateBankView(item.bank);
    }

    if (item.customer) {
      controls.client_id?.setValue(item.customer.internal_company_id);
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
    controls.currency?.setValue(item.currency);
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
    this.setBanks(item.banks);
    this.cdr.markForCheck();
  }

  @ViewChild('bankCollectionComponent')
  bankCollectionComponent?: CustomersBankCollectionComponent;

  updateBankView(item: CustomerBank[]) {
    this.setBanks(item);
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
      return;
    }

    const order = this.service.orders().find((item) => item.id === id);
    if (order) {
      if (this.form.controls.client_id && this.ConfirmDialogComponent) {
        const dialogRef = this.dialog.open(this.ConfirmDialogComponent, {
          width: '400px',
          data: { message: 'Import data from order?' },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            const order = this.service
              .orders()
              .find((order) => order.id === this.form.controls.order_id.value);
            this.importDataFromOrder(order);
            if (this.invoiceItems) {
              this.items = this.invoiceItems;
              this.cdr.markForCheck();
            }
          }
        });
      }
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
      this.form.controls.customer_id.setValue(customer.id);
      this.updateCustomerView(customer);
    }
  }

  protected getBankFormGroup(bank: CustomerBank): FormGroup<CustomerBankForm> {
    return new FormGroup({
      name: new FormControl(bank.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      code: new FormControl(bank.code, {
        nonNullable: true,
      }),
      iban: new FormControl(bank.iban, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bic: new FormControl(bank.bic, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      currency: new FormControl(bank.currency, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bank_template: new FormControl(
        {
          bic: bank.bank_template.bic,
          name: bank.bank_template.name,
          id: bank.bank_template.id,
          code: bank.bank_template.code,
          address: bank.bank_template.address,
          city: bank.bank_template.city,
        },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
    });
  }

  protected getEmptyBank(): CustomerBank {
    return {
      name: '',
      code: '',
      iban: '',
      bic: '',
      currency: '',
      bank_template: {
        name: '',
        id: '',
        bic: '',
        code: '',
        address: '',
        city: '',
      },
    };
  }

  protected parseBanks(banks: CustomerBank[]): CustomerBank[] {
    for (const bank of banks) {
      if (!bank.bank_template) {
        bank.bank_template = {
          name: '',
          id: '',
          bic: '',
          code: '',
          address: '',
          city: '',
        };
      }
      if (!bank.bank_template.id) {
        bank.bank_template.id = '';
      }
      if (!bank.bank_template.name) {
        bank.bank_template.name = '';
      }
      if (!bank.bank_template.bic) {
        bank.bank_template.bic = '';
      }
      if (!bank.bic) {
        bank.bic = '';
      }
      if (!bank.name) {
        bank.name = '';
      }
      if (!bank.iban) {
        bank.iban = '';
      }
      if (!bank.code) {
        bank.code = '';
      }
      if (!bank.currency) {
        bank.currency = '';
      }
    }

    return banks;
  }

  protected setBanks(banks: CustomerBank[]): void {
    banks = this.parseBanks(banks);

    if (banks.length === 0) {
      banks.push(this.getEmptyBank());
    }

    this.bankForms = [];
    for (const bank of banks) {
      this.bankForms.push(this.getBankFormGroup(bank));
    }
  }

  protected get banksValue() {
    return this.bankForms.map((item) => item.value);
  }

  order = computed<Order | undefined>(() => {
    const invoice = this.item();
    const orders = this.service.orders();
    let result: Order | undefined = undefined;
    if (orders && invoice) {
      result = orders.find((item) => item.id === invoice.order_id);
    }

    return result;
  });

  override ngOnInit() {
    super.ngOnInit();

    if (!this.bankForms || this.bankForms.length === 0) {
      this.setBanks([]);
    }

    this.searchingClientFieldControl.valueChanges.subscribe(() => {
      this.clientFetch();
    });

    this.clientFilterControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(null),
        tap((value) => {
          this.clientFetch();
        }),
      )
      .subscribe();
    this.searchingOrderFieldControl.valueChanges.subscribe(() => {
      this.orderFetch();
    });

    this.orderFilterControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(null),
        tap((value) => {
          this.orderFetch();
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
    this.form.controls.currency.valueChanges.subscribe(() => {
      const rate: any = this.deps.companyService.currencies?.find(
        (currency: any) => currency.ID === this.form.controls.currency.value,
      );
      this.form.controls.course.setValue(rate.rate);
    });
    this.form.controls.customer_id.valueChanges.subscribe(() => {
      this.service.readOrders(this.form.controls.customer_id.value);
    });
    this.setItemsListeners();
  }

  pageChange(pageChange: PageEvent, type: string) {
    switch (type) {
      case 'client':
        this.clientPagination = {
          page: pageChange.pageIndex + 1,
          limit: pageChange.pageSize,
        };
        this.clientFetch();
        break;
      default:
        this.orderPagination = {
          page: pageChange.pageIndex + 1,
          limit: pageChange.pageSize,
        };
        this.orderFetch();
        break;
    }
  }

  protected orderFetch() {
    const body: ModuleBaseReadRequest = {};
    if (this.orderPagination) {
      body.pagination = this.orderPagination;
    }
    if (
      this.orderFilterControl.value &&
      this.orderFilterControl.value?.length >= 2 &&
      this.searchingOrderFieldControl.value
    ) {
      body.search = {
        field: this.searchingOrderFieldControl.value,
        value: this.orderFilterControl.value,
      };
    }

    this.service.ordersService.read(body, false).subscribe({
      next: ([data, count]: any) => {
        this.orderPaginator.length = count;
        this.orders = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  protected clientFetch() {
    const body: ModuleBaseReadRequest = {};
    if (this.clientPagination) {
      body.pagination = this.clientPagination;
    }
    if (
      this.clientFilterControl.value &&
      this.clientFilterControl.value?.length >= 2 &&
      this.searchingClientFieldControl.value
    ) {
      body.search = {
        field: this.searchingClientFieldControl.value,
        value: this.clientFilterControl.value,
      };
    }

    this.service.customersService.read(body, false).subscribe({
      next: ([data, count]: any) => {
        this.clientPaginator.length = count;
        this.clients = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
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
    for (const bankComponent of this.bankCollectionComponents) {
      const form = bankComponent.formGroup;
      form.markAllAsTouched();
      result &&= form.valid;
      bankComponent.cdr.markForCheck();
    }
    this.cdr.markForCheck();
    return result;
  }

  protected override get values(): any {
    const values = super.values;
    delete values['internal_invoice_id'];
    if (this.invoiceItems) {
      return {
        ...super.values,
        bank: this.banksValue,
        order_id: this.form.controls.order_id.value,
        customer_id: this.form.controls.customer_id.value,
        items: this.invoiceItems,
      };
    }

    return {
      ...super.values,
      bank: this.banksValue,
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
    const item = this.item();
    if (!item || !this.itemsGroup.valid) {
      return;
    }
    const controls = this.itemsGroup.controls;
    this.service
      .addItem(item.id, {
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

  send() {
    this.deps.http
      .post(
        `${environment.apiUrl}/api/v1/invoices/send/${this.item()
          ?.id}?company_id=${this.service.companyId}`,
        {},
      )
      .subscribe((response) => {
        const data = response as { message: string };
        this.snackBar.open(data.message, 'Ok', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        const item = this.item();
        if (item) {
          this.fetchItem(item.id);
          this.service.readOrders(item.customer_id ?? null);
        }
      });
  }

  download() {
    this.deps.http
      .get(
        `${environment.apiUrl}/api/v1/invoices/download/${this.item()
          ?.id}?company_id=${this.service.companyId}`,
        { responseType: 'blob' },
      )
      .subscribe((response) => {
        const blob = new Blob([response as BlobPart], {
          type: 'application/octet-stream',
        });

        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `Invoice ID ${this.item()?.internal_invoice_id}.pdf`;
        a.click();
        a.remove();
      });
  }

  importDataFromOrder(order: Order | undefined) {
    if (order) {
      this.invoiceItems = [
        {
          id: 1,
          description: `Transport Services, ${order.loading_address} - ${order.unloading_address}, Ref. #${order.internal_order_id}`,
          quantity: 1,
          price_per_item: order.order_price,
          price_vat: order.order_price,
          price: order.order_price,
        },
      ];
    }
  }
  override update(): Observable<Invoice | undefined> {
    return new Observable<Invoice | undefined>((subscriber) => {
      super.update().subscribe((data) => {
        subscriber.next(data);
        subscriber.complete();
        this.service.readOrders(data?.customer_id ?? null);
      });
    });
  }

  protected readonly searchableColumns = defaultSearchableFields;
}
