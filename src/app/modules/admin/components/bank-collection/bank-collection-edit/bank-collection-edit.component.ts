import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EditComponentComponent } from '../../../../base-module/components/edit-component/edit-component.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminUser } from '../../../types/users';
import {
  BankCollection,
  BankCollectionResponse,
} from '../../../types/bank-collection';

type BankCollectionFormGroup = {
  name: FormControl<string>;
  bic: FormControl<string>;
  code: FormControl<string>;
  address: FormControl<string>;
  city: FormControl<string>;
};

@Component({
  selector: 'app-bank-collection-edit',
  templateUrl: './bank-collection-edit.component.html',
  styleUrls: ['./bank-collection-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankCollectionEditComponent
  extends EditComponentComponent<BankCollectionResponse, BankCollection>
  implements OnInit
{
  override form = new FormGroup<BankCollectionFormGroup>({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    bic: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    code: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    address: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    city: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  users: AdminUser[] = [];

  toDto(value: BankCollectionResponse): BankCollection {
    return value;
  }

  updateFormView(item: BankCollection): void {
    this.form.controls.name.setValue(item.name);
    this.form.controls.bic.setValue(item.bic);
    this.form.controls.code.setValue(item.code);
    this.form.controls.address.setValue(item.address);
    this.form.controls.city.setValue(item.city);
  }
}
