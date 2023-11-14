import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[appAddTab]' })
export class AddTabDirective {
  @Input()
  label?: string;
  constructor(public templateRef: TemplateRef<unknown>) {}
}
