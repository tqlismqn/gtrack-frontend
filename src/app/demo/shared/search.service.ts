import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DemoSearchService {
  private readonly termSignal = signal('');
  readonly term = this.termSignal.asReadonly();

  setTerm(term: string): void {
    this.termSignal.set(term);
  }
}
