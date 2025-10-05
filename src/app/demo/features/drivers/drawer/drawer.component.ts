import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Driver, DocKey } from '../../../shared/models';
import { DOC_ICONS, daysToState } from '../../../shared/docs.util';
import { totalSalary } from '../../../shared/salary.util';
import { uuid } from '../../../shared/uuid';

@Component({
  selector: 'app-drivers-drawer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DriversDrawerComponent implements OnChanges {
  @Input() driver: Driver | null = null;
  @Input() adding = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Driver>();
  @Output() shiftDocs = new EventEmitter<void>();

  form: FormGroup;

  readonly docKeys = Object.keys(DOC_ICONS) as DocKey[];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      rc: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: ['Active', Validators.required],
      citizenship: ['CZ', Validators.required],
      workplace: ['Praha', Validators.required],
      hireDate: [new Date().toISOString().slice(0, 10), Validators.required],
      contractType: ['Бессрочный', Validators.required],
      pasSouhlas: [true],
      propiskaCZ: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adding'] && this.adding) {
      this.form.reset({
        fullName: '',
        rc: '',
        email: '',
        phone: '',
        status: 'Active',
        citizenship: 'CZ',
        workplace: 'Praha',
        hireDate: new Date().toISOString().slice(0, 10),
        contractType: 'Бессрочный',
        pasSouhlas: true,
        propiskaCZ: true,
      });
    }
  }

  get totalSalary(): number {
    if (!this.driver) {
      return 0;
    }
    return totalSalary(this.driver.salary);
  }

  docState(key: DocKey): 'ok' | 'warn' | 'bad' {
    if (!this.driver) {
      return 'ok';
    }
    const doc = this.driver.docs[key];
    const days = Math.round((doc.expires - Date.now()) / (1000 * 60 * 60 * 24));
    return doc.uploaded ? daysToState(days) : 'bad';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const now = Date.now();
    const docs = Object.fromEntries(
      this.docKeys.map((key, index) => [
        key,
        {
          uploaded: true,
          expires: now + (90 + index * 10) * 24 * 60 * 60 * 1000,
        },
      ]),
    ) as Driver['docs'];

    const salary: Driver['salary'] = {
      base: 38000,
      bonus: 5000,
      deductions: 1500,
      trips: 4,
      perDiem: 3200,
    };

    const driver: Driver = {
      id: uuid(),
      fullName: this.form.value.fullName,
      rc: this.form.value.rc,
      email: this.form.value.email,
      phone: this.form.value.phone,
      status: this.form.value.status,
      citizenship: this.form.value.citizenship,
      workplace: this.form.value.workplace,
      hireDate: this.form.value.hireDate,
      contractType: this.form.value.contractType,
      pasSouhlas: this.form.value.pasSouhlas,
      propiskaCZ: this.form.value.propiskaCZ,
      docs,
      salary,
    };

    this.save.emit(driver);
  }
}
