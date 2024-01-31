import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BankCollection } from '../../../super-admin/types/bank-collection';
import { merge, ReplaySubject, startWith, takeUntil, tap } from 'rxjs';
import { CompanyService } from '../../../../services/company.service';

export interface CustomerBankForm {
  bank_template: FormControl<{
    name: string;
    id: string;
    bic: string;
    code: string;
    address: string;
    city: string;
  }>;

  currency: FormControl<string>;
  name: FormControl<string>;
  code: FormControl<string>;
  iban: FormControl<string>;
  bic: FormControl<string>;
}

@Component({
  selector: 'app-customers-bank-collection',
  templateUrl: './customers-bank-collection.component.html',
  styleUrls: ['./customers-bank-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersBankCollectionComponent
  implements OnInit, OnDestroy, OnChanges
{
  destroy$ = new EventEmitter<void>();

  @Input()
  formGroup = new FormGroup<CustomerBankForm>({
    bank_template: new FormControl(
      { name: '', id: '', bic: '', code: '', address: '', city: '' },
      {
        nonNullable: true,
      },
    ),
    bic: new FormControl<string>('', { nonNullable: true }),
    currency: new FormControl<string>('', { nonNullable: true }),
    name: new FormControl<string>('', { nonNullable: true }),
    code: new FormControl<string>('', { nonNullable: true }),
    iban: new FormControl<string>('', { nonNullable: true }),
  });

  @Input()
  banks: BankCollection[] = [];

  get currencies() {
    return (
      this.companyService.currencies?.map((currency: any) => {
        return currency.ID;
      }) ?? []
    );
  }

  bankFilterControl = new FormControl<string>('');

  banksFiltered: ReplaySubject<BankCollection[]> = new ReplaySubject<
    BankCollection[]
  >(1);

  constructor(
    public cdr: ChangeDetectorRef,
    protected companyService: CompanyService,
  ) {}

  ngOnDestroy() {
    this.destroy$.emit();
  }

  ngOnInit() {
    this.destroy$.emit();
    this.formGroup.controls.bank_template.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value) => {
          let bank = this.banks.find((item) => item.id === value.id);
          if (!bank) {
            bank = value;
          }

          this.formGroup.controls.bic.setValue(bank.bic);
          this.formGroup.controls.code.setValue(bank.code);
          this.formGroup.controls.name.setValue(bank.name);
          this.cdr.markForCheck();
        }),
      )
      .subscribe();

    this.bankFilterControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(null),
        tap((value) => {
          this.filterBanks(value);
        }),
      )
      .subscribe();

    merge(
      this.companyService.companyChanged$,
      this.companyService.companiesUpdated$,
    )
      .pipe(
        startWith(undefined),
        takeUntil(this.destroy$),
        tap(() => {
          this.cdr.markForCheck();
        }),
      )
      .subscribe();

    if (this.formGroup.controls.bank_template.value) {
      this.checkBankSelector();
    }
  }

  protected filterBanks(value: string | null) {
    if (!this.banks || this.banks.length === 0) {
      return;
    }

    if (!value || value.length === 0) {
      this.banksFiltered.next([...this.banks]);
      return;
    }

    value = value.toLowerCase();
    this.banksFiltered.next(
      this.banks.filter((bank) =>
        !value ? true : this.getSearchString(bank).indexOf(value) > -1,
      ),
    );
  }

  protected getSearchString(bank: BankCollection) {
    return `${bank.name} ${bank.bic} ${bank.city} ${bank.address}`.toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['banks'] || changes['formGroup']) {
      this.ngOnInit();
    }
  }

  public checkBankSelector() {
    const value = this.formGroup.controls.bank_template.value;
    let bank = this.banks.find((item) => item.id === value.id);
    if (
      !bank &&
      value &&
      value.id &&
      value.name &&
      value.bic &&
      value.code &&
      value.address &&
      value.city
    ) {
      this.banks = [...this.banks];
      this.banks.push(value);
      bank = value;
    }
    if (bank) {
      this.formGroup.controls.bank_template.setValue(bank);
      this.cdr.markForCheck();
    }
  }
}
