import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.css']
})
export class NavTabsComponent implements OnInit {
  @Output('selectedNav')tab = new EventEmitter();
  @Input('defaultTab') defaultTab:any={id:2,name: 'Reactive'};

  navItems:any[]=[];
  selectedNav:any;

  constructor() {
    this.navItems=[{id:1,name:"Template Driven"},{id:2,name:"Reactive"}];
    this.selectedNav = this.defaultTab || this.navItems[0];
   }

  ngOnInit(): void {
  }

  switchTab(nav:number){
    this.selectedNav = this.navItems.find(n=>n.id===nav) || this.navItems[0];
    this.tab.emit(this.selectedNav);
  }
}
