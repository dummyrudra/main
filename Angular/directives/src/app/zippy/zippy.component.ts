import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'zippy',
  templateUrl: './zippy.component.html',
  styleUrls: ['./zippy.component.css']
})
export class ZippyComponent implements OnInit {
  @Input("title") title?: string
  isExapanded: boolean =false
  constructor() { }
   
  ngOnInit() {}
  expand(){
    this.isExapanded = !this.isExapanded
  }

}
