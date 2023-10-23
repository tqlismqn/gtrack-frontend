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
import { BankCollection } from '../../../admin/types/bank-collection';
import { takeUntil, tap } from 'rxjs';

export interface CustomerBankForm {
  bank_template: FormControl<{
    name: string;
    id: string;
    bic: string;
    code: string;
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
      { name: '', id: '', bic: '', code: '' },
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

  currencies = ['USD', 'EUR'];

  constructor(protected cdr: ChangeDetectorRef) {}

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
          this.cdr.markForCheck();
        }),
      )
      .subscribe();

    if (this.formGroup.controls.bank_template.value) {
      this.checkBankSelector();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['banks'] || changes['formGroup']) {
      this.ngOnInit();
    }
  }

  checkBankSelector() {
    const value = this.formGroup.controls.bank_template.value;
    let bank = this.banks.find((item) => item.id === value.id);
    if (!bank && value && value.id && value.name && value.bic && value.code) {
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
