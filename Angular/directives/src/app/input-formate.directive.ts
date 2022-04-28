import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputFormate]'
})
export class InputFormateDirective {
  @Input("appInputFormate") formate?:string;
  constructor(private el:ElementRef,) { }

  @HostListener("keyup") onblur(){
    let value:string = this.el.nativeElement.value;
      if(this.formate==="uppercase")
    this.el.nativeElement.value = value.toUpperCase();
    else
      this.el.nativeElement.value = value.toLowerCase();
  }
}
