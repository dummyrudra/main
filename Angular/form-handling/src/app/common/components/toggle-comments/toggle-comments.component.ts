import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'toggle-comments',
  templateUrl: './toggle-comments.component.html',
  styleUrls: ['./toggle-comments.component.css'],
})
export class ToggleCommentsComponent implements OnInit {
  // isExpanded: boolean = false;
  @Input('post') post: any;
  @Output('toggleCommentEvent') toggleCommentEvent = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  toggleComments() {
    if (this.post) {
      this.post.isExpanded = !this.post.isExpanded;
      this.toggleCommentEvent.emit(this.post);
    }
  }
}
