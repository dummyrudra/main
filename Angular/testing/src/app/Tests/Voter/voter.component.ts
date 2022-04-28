import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'voter',
  templateUrl: './voter.component.html',
  styleUrls: ['./voter.component.css'],
})
export class VoterComponent {
  totalVotes: number = 0;
  myVote: number = 0;
  voteChanged = new EventEmitter();

  upVote() {
    if (this.myVote === 1) return;

    this.myVote = 1;
    this.totalVotes += 1;
    this.voteChanged.emit(this.totalVotes);
  }

  downVote() {
    if (this.myVote === -1) return;

    this.myVote = -1;
    this.totalVotes -= 1;
    this.voteChanged.emit(this.totalVotes);
  }
}
