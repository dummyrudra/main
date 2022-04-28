import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'friends-card',
  templateUrl: './friends-card.component.html',
  styleUrls: ['./friends-card.component.css'],
})
export class FriendsCardComponent implements OnInit {
  @Input('friends') friends: any;
  imageUrl: string;
  constructor() {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {}

  isNoFriends(friends: any): boolean {
    return friends?.find((f: any) => f.status === 'success') ? false : true;
  }
}
