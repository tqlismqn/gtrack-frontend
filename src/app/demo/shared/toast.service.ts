import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar, { optional: true });

  open(message: string, action = 'OK', duration = 3000): void {
    if (!this.snackBar) {
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
      return;
    }

    this.snackBar.open(message, action, { duration });
  }
}
