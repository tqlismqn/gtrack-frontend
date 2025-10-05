import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[appAddTab]', standalone: false })
export class AddTabDirective {
  @Input()
  label?: string;
  constructor(public templateRef: TemplateRef<unknown>) {}
}
