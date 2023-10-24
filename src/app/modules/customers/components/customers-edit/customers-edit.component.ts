import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditComponentComponent } from '../../../base-module/components/edit-component/edit-component.component';
import {
  Customer,
  CustomerBank,
  CustomerDocument,
  CustomerRaiting,
  CustomerRaitingType,
  CustomerResponse,
} from '../../types/customers.type';
import { CustomersUtils } from '../../utils/customers-utils';
import { countries } from 'countries-list';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { CustomerBankForm } from '../customers-bank-collection/customers-bank-collection.component';
import {
  BankCollection,
  BankCollectionResponse,
} from '../../../admin/types/bank-collection';
import { Nameable } from '../../../base-module/types/nameable.type';

interface CustomersEditForm {
  id?: FormControl<string>;
  company_name?: FormControl<string>;
  vat_id?: FormControl<string>;
  internal_company_id?: FormControl<number | null>;
  contact_name?: FormControl<string>;
  contact_phone?: FormControl<string>;
  contact_email?: FormControl<string>;
  accounting_email?: FormControl<string>;
  nation?: FormControl<string>;
  zip?: FormControl<string>;
  city?: FormControl<string>;
  street?: FormControl<string>;
  remark?: FormControl<string | null>;
  documents?: FormControl<CustomerDocument[]>;
  terms_of_payment?: FormControl<string>;
  pallet_balance?: FormControl<number>;
  insurance_credit_limit?: FormControl<number>;
  available_insurance_limit?: FormControl<number>;
  internal_credit_limit?: FormControl<number>;
  total_available_credit_limit?: FormControl<number>;
}

@Component({
  selector: 'app-customers-edit',
  templateUrl: './customers-edit.component.html',
  styleUrls: ['./customers-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersEditComponent
  extends EditComponentComponent<CustomerResponse, Customer>
  implements OnInit
{
  override form = new FormGroup<CustomersEditForm>({
    company_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    vat_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    internal_company_id: new FormControl<number | null>(null),
    contact_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    contact_phone: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    contact_email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    accounting_email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),

    nation: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    zip: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    city: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    street: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),

    remark: new FormControl<string>(''),
    documents: new FormControl<CustomerDocument[]>([], { nonNullable: true }),

    terms_of_payment: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    pallet_balance: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),

    insurance_credit_limit: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    available_insurance_limit: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    internal_credit_limit: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    total_available_credit_limit: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  bankForms: FormGroup<CustomerBankForm>[] = [];
  bankCollections: BankCollection[] = [];

  get firstBank(): FormGroup<CustomerBankForm> | undefined {
    return this.bankForms[0];
  }

  get otherBanks(): FormGroup<CustomerBankForm>[] {
    return this.bankForms.slice(1);
  }

  countries = Object.keys(countries);

  updateFormView(item: Customer) {
    this.form.controls.company_name?.setValue(item.company_name);
    this.form.controls.vat_id?.setValue(item.vat_id);
    this.form.controls.internal_company_id?.setValue(item.internal_company_id);
    this.form.controls.contact_name?.setValue(item.contact_name);
    this.form.controls.contact_phone?.setValue(item.contact_phone);
    this.form.controls.contact_email?.setValue(item.contact_email);
    this.form.controls.accounting_email?.setValue(item.accounting_email);
    this.form.controls.nation?.setValue(item.nation);
    this.form.controls.zip?.setValue(item.zip);
    this.form.controls.city?.setValue(item.city);
    this.form.controls.street?.setValue(item.street);
    this.form.controls.remark?.setValue(item.remark);
    this.form.controls.documents?.setValue(item.documents);
    this.form.controls.terms_of_payment?.setValue(item.terms_of_payment);
    this.form.controls.pallet_balance?.setValue(item.pallet_balance);
    this.form.controls.insurance_credit_limit?.setValue(
      item.insurance_credit_limit,
    );
    this.form.controls.available_insurance_limit?.setValue(
      item.available_insurance_limit,
    );
    this.form.controls.internal_credit_limit?.setValue(
      item.internal_credit_limit,
    );
    this.form.controls.total_available_credit_limit?.setValue(
      item.total_available_credit_limit,
    );

    this.bankForms = [];
    this.setBanks(item.banks ?? []);

    if (this.item?.raiting) {
      this.item.raiting = this.sortRaiting(this.item.raiting);
    }
  }

  isDragging = false;
  async onFilesChange(files: FileList | null) {
    if (!files) {
      return;
    }
    for (const file of Array.from(files)) {
      await this.addFile(file);
    }
  }

  protected addFile(file: File) {
    return new Promise<void>((resolve, reject) => {
      const document: CustomerDocument = {
        file,
        name: file.name,
        lastModified: file.lastModified,
      };

      this.uploadDocument(document).subscribe({
        next: (fileId) => {
          document.id = fileId;
          if (!this.form.controls.documents) {
            return;
          }
          const files = this.form.controls.documents.value ?? [];
          files.push(document);

          this.form.controls.documents.setValue(files);
          this.cdr.markForCheck();
          resolve();
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  removeFile(doc: CustomerDocument) {
    this.deleteDocument(doc).subscribe(() => {
      if (!this.form.controls.documents) {
        return;
      }

      const docs = this.form.controls.documents.value ?? [];
      const docIndex = docs.indexOf(doc);
      if (docIndex > -1) {
        docs.splice(docIndex, 1);
      }

      this.form.controls.documents.setValue(docs);
      this.cdr.markForCheck();
    });
  }

  downloadFile(doc: CustomerDocument) {
    this.http
      .get(
        `${environment.apiUrl}/api/v1/${this.module}/download/${this.item?.id}?company_id=${this.companyService.selectedCompany?.id}&id=${doc.id}`,
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

  async drop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      for (const file of Array.from(event.dataTransfer.files)) {
        await this.addFile(file);
      }
    } else if (event.dataTransfer?.items) {
      for (const item of Array.from(event.dataTransfer.items)) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            await this.addFile(file);
          }
        }
      }
    }
  }

  toDto = CustomersUtils.customerResponseToDTO;

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

  protected addBank() {
    this.bankForms.push(this.getBankFormGroup(this.getEmptyBank()));
  }

  protected uploadDocument(document: CustomerDocument) {
    return new Observable<string>((subscriber) => {
      const formData = new FormData();
      formData.append('file', document.file ?? '');
      formData.append('name', document.name);
      formData.append('last_modified', String(document.lastModified));

      this.http
        .post(
          `${environment.apiUrl}/api/v1/${this.module}/upload/create/${this.item?.id}?company_id=${this.companyService.selectedCompany?.id}`,
          formData,
        )
        .subscribe({
          next: (response) => {
            const data = response as { id: string };
            subscriber.next(data.id);
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  protected deleteDocument(document: CustomerDocument) {
    return new Observable<void>((subscriber) => {
      const formData = new FormData();
      formData.append('id', document.id ?? '');

      this.http
        .post(
          `${environment.apiUrl}/api/v1/${this.module}/upload/delete/${this.item?.id}?company_id=${this.companyService.selectedCompany?.id}`,
          formData,
        )
        .subscribe({
          next: () => {
            subscriber.next();
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.fetchBankCollections();

    if (!this.bankForms || this.bankForms.length === 0) {
      this.setBanks([]);
    }
    if (this.type === 'update') {
      this.companyService.getUserSelections().subscribe((selections) => {
        for (const user of selections) {
          this.users[user.id] = user;
        }
        this.cdr.markForCheck();
      });
    }
  }

  protected fetchBankCollections() {
    this.http
      .post(`${environment.apiUrl}/api/v1/bank_collections/read`, {})
      .subscribe((response) => {
        this.bankCollections = (response as BankCollectionResponse[]).map(
          (item) => ({
            name: item.name,
            id: item.id,
            bic: item.bic,
            code: item.code,
            address: item.address,
            city: item.city,
          }),
        );
        this.cdr.markForCheck();
      });
  }

  protected get banksValue() {
    return this.bankForms.map((item) => item.value);
  }

  protected override get values() {
    const values = this.form.value;
    delete values.documents;

    return {
      ...values,
      banks: this.banksValue,
    };
  }

  protected override get formValid(): boolean {
    let result = super.formValid;
    for (const form of this.bankForms) {
      form.markAllAsTouched();
      result &&= form.valid;
    }
    this.cdr.markForCheck();
    return result;
  }

  raitings: CustomerRaitingType[] = [
    CustomerRaitingType.RED,
    CustomerRaitingType.YELLOW,
    CustomerRaitingType.GREEN,
  ];
  raitingForm = new FormGroup({
    raiting: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    comment: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  users: Record<string, Nameable> = {};

  addRaiting() {
    this.sendRaiting().subscribe();
  }

  protected sendRaiting() {
    return new Observable<CustomerRaiting[] | undefined>((subscriber) => {
      this.raitingForm.markAllAsTouched();
      if (!this.raitingForm.valid) {
        subscriber.next(undefined);
        subscriber.complete();
        return;
      }

      this.http
        .post(
          `${environment.apiUrl}/api/v1/${this.module}/raiting/add/${this.item?.id}?company_id=${this.companyService.selectedCompany?.id}`,
          this.raitingForm.value,
        )
        .subscribe({
          next: (response) => {
            const data = this.sortRaiting(response as CustomerRaiting[]);

            this.item!.raiting = data;
            this.raitingForm.reset();
            this.cdr.markForCheck();
            subscriber.next(data);
            subscriber.complete();
          },
          error: (err) => {
            subscriber.error(err);
            subscriber.complete();
          },
        });
    });
  }

  sortRaiting(data: CustomerRaiting[]) {
    return data.sort((a, b) => {
      if (a.date === b.date) {
        return 0;
      }
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate > bDate ? -1 : 1;
    });
  }

  getUserName(id: string) {
    return this.users[id]?.name;
  }

  getRaitingClassName = CustomersEditComponent._getRaitingClassName;

  static _getRaitingClassName(raiting: CustomerRaitingType | string) {
    if (typeof raiting === 'string') {
      raiting = Number(raiting);
    }
    switch (raiting) {
      case CustomerRaitingType.GREEN:
        return 'green';
      case CustomerRaitingType.RED:
        return 'red';
      case CustomerRaitingType.YELLOW:
        return 'yellow';
    }
  }
}
