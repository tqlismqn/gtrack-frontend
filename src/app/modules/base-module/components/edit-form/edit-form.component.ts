import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LoadingState } from '../../../auth/components/auth-form/auth-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFormComponent {
  @Output()
  submit$ = new EventEmitter<void>();

  @Input()
  formTitle?: string;

  @Input()
  submitTitle = 'Save';

  errors?: { [key: string]: string };

  loading = false;
  loadingState: LoadingState = 'loading';

  constructor(
    protected cdr: ChangeDetectorRef,
    protected location: Location,
  ) {}

  startLoading() {
    this.loading = true;
    this.loadingState = 'loading';
  }

  endLoading(state: LoadingState) {
    this.loadingState = state;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.loading = false;
      this.cdr.markForCheck();
    }, 500);
  }

  processError(error: any) {
    this.endLoading('error');
    throw error;
  }
}
