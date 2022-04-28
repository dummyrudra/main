import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
})
export class FriendsListComponent implements OnInit {
  @Input('friends') friends: any;
  @Input('friendId') friendId: string = '';
  imageUrl: string;
  successFriends: any = [];

  constructor() {
    this.imageUrl = environment.imageUrl;
    if (!this.friends?.some((f: any) => f?.user?._id === this.friendId)) {
      this.friendId = '';
    }
  }

  ngOnInit(): void {}
}
