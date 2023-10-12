import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CompanyService } from '../../../../services/company.service';
import { EditFormComponent } from '../../../base-module/components/edit-form/edit-form.component';
import { EditComponentComponent } from '../../../base-module/components/edit-component/edit-component.component';
import { Customer, CustomerResponse } from '../../types/customers.type';
import { CustomersUtils } from '../../utils/customers-utils';

@Component({
  selector: 'app-customers-create',
  templateUrl: './customers-edit.component.html',
  styleUrls: ['./customers-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersEditComponent extends EditComponentComponent<
  CustomerResponse,
  Customer
> {
  override form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  updateFormView(item: Customer) {
    this.form.controls.name.setValue(item.name);
  }

  toDto = CustomersUtils.customerResponseToDTO;
}
