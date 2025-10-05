import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DriverFilters } from '../../../shared/models';

@Component({
  selector: 'app-drivers-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class DriversFiltersComponent implements OnChanges {
  @Input() filters!: DriverFilters;
  @Output() filtersChange = new EventEmitter<Partial<DriverFilters>>();
  @Output() reset = new EventEmitter<void>();

  form: FormGroup;

  readonly statusOptions: Array<{ label: string; value: DriverFilters['status'] }> = [
    { label: 'Все', value: 'all' },
    { label: 'Active', value: 'Active' },
    { label: 'On Leave', value: 'OnLeave' },
    { label: 'Inactive', value: 'Inactive' },
  ];
  readonly docOptions = [
    { label: 'Все', value: 'all' },
    { label: 'OK', value: 'ok' },
    { label: '⚠️ Предупреждения', value: 'warn' },
    { label: '⛔️ Проблемы', value: 'bad' },
  ];
  readonly citizenshipOptions = [
    { label: 'Все', value: 'all' },
    { label: 'CZ', value: 'CZ' },
    { label: 'EU', value: 'EU' },
    { label: 'Non-EU', value: 'Non-EU' },
  ];
  readonly workplaceOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Praha', value: 'Praha' },
    { label: 'Kladno', value: 'Kladno' },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      status: ['all'],
      docState: ['all'],
      citizenship: ['all'],
      workplace: ['all'],
      problemsOnly: [false],
    });

    this.form.valueChanges.subscribe((value) =>
      this.filtersChange.emit(value as Partial<DriverFilters>),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters) {
      this.form.patchValue(this.filters, { emitEvent: false });
    }
  }

  resetFilters(): void {
    this.reset.emit();
  }
}
