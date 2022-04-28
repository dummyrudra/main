import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommentService } from 'src/app/services/comment.service';
import { environment } from 'src/environments/environment';
import { BadInput } from '../../bad-input';
import { NotFoundError } from '../../not-found-error';
import { UnauthorisedError } from '../../unauthorised-error';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent implements OnInit {
  form: any;
  @Input('user') user: any;
  @Input('post') post: any;
  @Output('newCommentEvent') newCommentEvent = new EventEmitter();
  imageUrl: string;

  constructor(
    fb: FormBuilder,
    private service: CommentService,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl;
    this.form = fb.group({
      comment: fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  comment() {
    if (!this.user?._id) {
      this.toastr.warning('', 'Login to comment on post', {
        progressBar: true,
        closeButton: true,
        timeOut: 800,
      });
      return;
    }
    if (!this.form.valid) return;

    this.service
      .create({
        comment: this.form.get('comment').value,
        userId: this.user?._id,
        postId: this.post?._id,
      })
      .subscribe(
        (response) => {
          let post = JSON.stringify(response);
          this.form.reset();
          this.newCommentEvent.emit(
            JSON.parse(post)?.comments[JSON.parse(post)?.comments?.length - 1]
          );
        },
        (error) => {
          this.form.reset();
          this.handleError(error);
        }
      );
  }

  handleError(error: any) {
    if (
      error instanceof UnauthorisedError ||
      error instanceof BadInput ||
      error instanceof NotFoundError
    )
      this.toastr.error(
        error?.originalError?.error?.message || 'Not Found',
        error?.originalError?.status,
        {
          progressBar: true,
          closeButton: true,
          timeOut: 800,
        }
      );
    else
      this.toastr.error('Something went wrong!', '500', {
        progressBar: true,
        closeButton: true,
        timeOut: 800,
      });
  }
}
