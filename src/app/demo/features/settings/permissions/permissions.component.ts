import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { StorageService } from '../../../shared/storage.service';

interface PermissionsModel {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  access: {
    orders: boolean;
    invoices: boolean;
    drivers: boolean;
    settings: boolean;
  };
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatCheckboxModule, MatChipsModule],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly storage: StorageService) {
    this.form = this.fb.nonNullable.group({
      isAdmin: true,
      isSuperAdmin: false,
      access: this.fb.nonNullable.group({
        orders: true,
        invoices: true,
        drivers: true,
        settings: true,
      }),
    });
  }

  ngOnInit(): void {
    const saved = this.storage.getItem<PermissionsModel>(this.storage.permissionsKey);
    if (saved) {
      this.form.patchValue(saved);
    }

    this.form.valueChanges.subscribe((value) => {
      this.storage.setItem(this.storage.permissionsKey, value as PermissionsModel);
    });
  }

  get summary(): string[] {
    const value = this.form.value as PermissionsModel;
    const roles = [
      value.isAdmin ? 'Admin' : null,
      value.isSuperAdmin ? 'SuperAdmin' : null,
    ].filter(Boolean) as string[];
    const access = Object.entries(value.access)
      .filter(([, allowed]) => allowed)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    return [...roles, ...access];
  }
}
