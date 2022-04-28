import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {
  count:number=0
  constructor() { }

  ngOnInit(): void {
  }
  incrementCount(){
    if(this.count<10)
    this.count+=1;
  }
  decrementCount(){
    if(this.count>0)
    this.count-=1;
  }

}
