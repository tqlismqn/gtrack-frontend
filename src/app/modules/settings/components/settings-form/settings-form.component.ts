import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../../services/company.service';
import { Currencies, CurrenciesArray } from '../../../../types/currencies';
import { merge, startWith, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFormComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    employees_number: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    website: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    available_currencies: new FormControl<Currencies[]>([...CurrenciesArray], {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  currencies = CurrenciesArray;

  destroy$ = new EventEmitter<void>();

  loading = false;

  constructor(
    protected companyService: CompanyService,
    protected cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    merge(
      this.companyService.companyChanged$,
      this.companyService.companiesUpdated$,
    )
      .pipe(
        startWith(undefined),
        takeUntil(this.destroy$),
        tap(() => {
          this.updateFormView();
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  get company() {
    return this.companyService.selectedCompany;
  }

  updateFormView() {
    if (this.company) {
      this.form.controls.available_currencies.setValue(
        this.company.currencies.map((currency: any) => currency.ID),
      );
      this.form.controls.website.setValue(this.company.website);
      this.form.controls.name.setValue(this.company.name);
      this.form.controls.employees_number.setValue(
        this.company.employees_number,
      );
      this.cdr.markForCheck();
    }
  }

  submit() {
    console.log(this.form.value);
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.cdr.markForCheck();
    this.companyService.update(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
        throw err;
      },
    });
  }
}
