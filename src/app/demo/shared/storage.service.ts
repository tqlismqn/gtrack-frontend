import { Injectable } from '@angular/core';

const DRIVERS_KEY = 'gtrack_demo_drivers_v4';
const LEGACY_KEYS = ['gtrack_demo_drivers', 'gtrack_demo_drivers_v2', 'gtrack_demo_drivers_v3'];

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly driversKey = DRIVERS_KEY;
  readonly permissionsKey = 'gtrack_demo_permissions';
  readonly themeKey = 'gtrack_demo_theme';

  private storage: Storage | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
      for (const key of LEGACY_KEYS) {
        this.storage.removeItem(key);
      }
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.storage) {
      return null;
    }
    try {
      const raw = this.storage.getItem(key);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error('StorageService getItem error', error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!this.storage) {
      return;
    }
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('StorageService setItem error', error);
    }
  }

  remove(key: string): void {
    this.storage?.removeItem(key);
  }
}
