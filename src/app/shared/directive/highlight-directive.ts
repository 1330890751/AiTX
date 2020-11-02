import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  constructor(el: ElementRef) {
    el.nativeElement.classList.add = 'highlight';
  }
}
