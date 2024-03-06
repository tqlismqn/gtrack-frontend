import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { AuthService } from '../modules/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  public auth?: AuthService;

  constructor(
    protected snackBar: MatSnackBar,
    protected ngZone: NgZone,
    protected dialog: MatDialog,
    protected router: Router,
  ) {}

  openedError?: string;

  dialogRef: MatDialogRef<ErrorDialogComponent> | undefined;

  handleError(error: any): void {
    console.error(error);
    if (!(error instanceof HttpErrorResponse) && error.rejection) {
      error = error.rejection;
    }

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          if (error.error?.code === 'account_linked') {
            this.auth?.auth0.loginWithRedirect();
          } else if (error.error?.code === 'email_not_verified') {
            this.router.navigate(['/verify']);
          } else {
            this.authorizationExpiredError();
          }
          return;
      }

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

  authorizationExpiredError() {
    if (this.openedError === '401') {
      return;
    }

    this.dialogRef = this.dialog.open(ErrorDialogComponent, {
      disableClose: true,
      data: {
        title: 'Error',
        text: 'Your authorization seems to be expired. Please, try again, reload page or Log out.',
        confirmText: 'Log out',
        confirmCallback: () => {
          this.auth?.logout();
        },
      },
    });
    this.openedError = '401';

    this.dialogRef.afterClosed().subscribe(() => {
      if (this.openedError === '401') {
        this.openedError = undefined;
      }
    });
  }
}
