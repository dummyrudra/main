import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css'],
})
export class LikeComponent implements OnInit {
  @Input('isLiked') isLiked: any;
  @Output('likeEvent') likeEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  raiseLikeEvent(isLiked: Boolean): void {
    // this.isLiked = isLiked;
    this.likeEvent.emit(isLiked);
  }
}
