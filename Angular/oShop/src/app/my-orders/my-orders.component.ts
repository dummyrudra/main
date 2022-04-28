import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit, AfterViewInit {
  // @ViewChild('productsTable') table: DatatableComponent;

  ngOnInit(): void {}
  ngAfterViewInit() {
    // this.table.offset = 0;
  }
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];
  constructor() {
    // this.table.offset = 0;
  }
}
