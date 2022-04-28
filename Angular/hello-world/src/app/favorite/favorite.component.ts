import { Component, OnInit,Input, Output,EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styles:[`.bi-star-fill{color:red},{}`],
  styleUrls: ['./favorite.component.css'],
  encapsulation:ViewEncapsulation.Emulated      // [ Emulated:{styles that are inside component will be applicable with global styles}, Shadow DOM:{styles that are inside component will be applicable without global styles}, None:{Properties will leak outside} ]

  // inputs:["isFavorite"]
})
export class FavoriteComponent implements OnInit {
 @Input("isFavorite") isSelected ?: boolean ;
 @Output("change") click = new EventEmitter();
 
  constructor() { }

  ngOnInit(): void {
  }
  onFavorite(){
    this.isSelected= !this.isSelected;
    this.click.emit({newValue:this.isSelected});
  }
}

export interface FavoriteChangedEventArgs{
  newValue:boolean
}
