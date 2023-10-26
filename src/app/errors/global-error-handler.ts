import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    protected snackBar: MatSnackBar,
    protected ngZone: NgZone,
  ) {}

  handleError(error: any): void {
    console.error(error);
    if (!(error instanceof HttpErrorResponse) && error.rejection) {
      error = error.rejection;
    }

    if (error instanceof HttpErrorResponse) {
      if (error?.error?.errors) {
        //
      }
      if (error?.error?.message) {
        this.ngZone.run(() => {
          this.snackBar.open(error.error.message, 'Ok', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        });
      }
    }
  }
}
