import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  EditComponentComponent,
  EditComponentDeps,
} from '../../../../base-module/components/edit-component/edit-component.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminUser } from '../../../types/users';
import { ActivatedRoute } from '@angular/router';
import {
  AdminCurrencies,
  AdminCurrenciesResponse,
} from '../../../../../types/currencies';
import { CurrenciesService } from '../../../../../services/currencies.service';

type CurrencyFormGroup = {
  id: FormControl<string>;
  rate: FormControl<number>;
};

@Component({
  selector: 'app-bank-collection-edit',
  templateUrl: './currencies-edit.component.html',
  styleUrls: ['./currencies-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesEditComponent
  extends EditComponentComponent<AdminCurrenciesResponse, AdminCurrencies>
  implements OnInit
{
  override form = new FormGroup<CurrencyFormGroup>({
    id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rate: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    service: CurrenciesService,
    deps: EditComponentDeps,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
  ) {
    super(service, deps, cdr, route);
  }

  users: AdminUser[] = [];

  updateFormView(item: AdminCurrencies): void {
    this.form.controls.id.setValue(item.id);
    this.form.controls.rate.setValue(item.rate);
  }
}
