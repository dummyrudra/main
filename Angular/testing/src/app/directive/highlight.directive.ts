import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  defaultColor = 'yellow';
  @Input('highlight') bgColor: string = '';
  constructor(private eleRef: ElementRef) {}
  ngOnChanges() {
    this.eleRef.nativeElement.style.backgroundColor =
      this.bgColor || this.defaultColor;
  }
}
