import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompanyService } from '../../../../services/company.service';
import { Currencies, CurrenciesArray } from '../../../../types/currencies';
import { merge, startWith, takeUntil, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CompanyResponse } from "../../../../types/company.type";

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

  currenciesForm: FormGroup;

  currencies = CurrenciesArray;

  destroy$ = new EventEmitter<void>();

  loading = false;
  dataSource!: { rate: any; ID: any }[];

  constructor(
    protected companyService: CompanyService,
    protected cdr: ChangeDetectorRef,
    protected fb: FormBuilder,
    protected http: HttpClient,
  ) {
    this.currenciesForm = this.fb.group({});
  }

  ngOnInit() {
    if (this.company) {
      this.form.controls.available_currencies.setValue(
        this.company.currencies.map((currency: any) => currency.ID),
      );
    }
    this.form.controls.available_currencies.valueChanges.subscribe(() => {
      this.updateCurrenciesFormView();
    });
    merge(
      this.companyService.companyChanged$,
      this.companyService.companiesUpdated$,
    )
      .pipe(
        startWith(undefined),
        takeUntil(this.destroy$),
        tap(() => {
          this.updateFormView();
          this.updateCurrenciesFormView();
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

  updateCurrenciesFormView() {
    if (this.company) {
      const currenciesMap = new Map(
        this.company.currencies.map((currency: any) => [
          currency.ID,
          currency.rate,
        ]),
      );
      const selectedCurrencies =
        this.form.controls.available_currencies.value.map((currency: any) => {
          if (currenciesMap.has(currency)) {
            return { ID: currency, rate: currenciesMap.get(currency) };
          } else {
            return { ID: currency, rate: '1.00' };
          }
        });

      for (const controlName in this.currenciesForm.controls) {
        this.currenciesForm.removeControl(controlName);
      }
      selectedCurrencies.map((data: any) => {
        this.currenciesForm.addControl(
          data.ID,
          new FormControl(data.rate, {
            validators: [Validators.required],
            nonNullable: true,
          }),
        );
      });
      this.dataSource = selectedCurrencies.map((key: any) => {
        return { ID: key.ID, rate: key.rate };
      });
    }
  }

  updateFormView() {
    if (this.company) {
      this.form.controls.website.setValue(this.company.website);
      this.form.controls.name.setValue(this.company.name);
      this.form.controls.employees_number.setValue(
        this.company.employees_number,
      );
      this.cdr.markForCheck();
    }
  }

  submit() {
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

  updateCurrencies() {
    if (!this.currenciesForm.valid) {
      return;
    }
    const currencies = Object.keys(this.currenciesForm.value).map((key) => ({
      ID: key,
      rate: parseFloat(this.currenciesForm.value[key]).toFixed(2),
    }));
    this.http
      .patch(
        `${environment.apiUrl}/api/v1/companies/update?company_id=${this.company?.id}`,
        { currencies: currencies },
      )
      .subscribe({
        next: (response) => {
          const company = response as CompanyResponse;

          this.companyService.updateCompaniesLocally(company);
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
