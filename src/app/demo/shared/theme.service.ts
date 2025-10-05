import { Injectable, effect, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly body = typeof document !== 'undefined' ? document.body : null;
  private readonly themeSignal = signal<ThemeMode>('light');

  readonly theme = this.themeSignal.asReadonly();

  constructor(private readonly storage: StorageService) {
    const stored = this.storage.getItem<ThemeMode>(this.storage.themeKey);
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.themeSignal.set(stored ?? (prefersDark ? 'dark' : 'light'));

    effect(() => {
      const current = this.themeSignal();
      if (!this.body) {
        return;
      }
      this.body.classList.toggle('dark', current === 'dark');
      this.storage.setItem(this.storage.themeKey, current);
    });
  }

  toggle(): void {
    this.setTheme(this.themeSignal() === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this.themeSignal.set(mode);
  }
}
