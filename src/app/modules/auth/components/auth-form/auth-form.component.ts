import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  @Output()
  submit$ = new EventEmitter<void>();

  @Input()
  title?: string;

  @Input()
  submitTitle = 'Send';

  @Input()
  showActions = true;

  loading = false;
  loadingState: LoadingState = 'loading';

  constructor(
    protected cdr: ChangeDetectorRef,
    protected snackBar: MatSnackBar,
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
