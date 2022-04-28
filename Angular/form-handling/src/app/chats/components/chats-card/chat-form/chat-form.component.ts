import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BadInput } from 'src/app/common/bad-input';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnauthorisedError } from 'src/app/common/unauthorised-error';
import { ConversationService } from 'src/app/services/conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css'],
})
export class ChatFormComponent implements OnInit {
  @Input('user') user: any;
  @Input('friend') friend: any;
  @Output('chat') chat = new EventEmitter();
  imageUrl: string;
  form: any;

  constructor(
    private conversationService: ConversationService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.imageUrl = environment.imageUrl;
    this.form = fb.group({
      message: fb.control('', [Validators.required, Validators.nullValidator]),
    });
  }

  ngOnInit(): void {}

  send() {
    if (!this.form.valid) return;
    let requestData = {
      message: this.form.get('message').value,
      receiver: this.friend?._id,
    };
    this.form.reset();

    this.conversationService.create(requestData).subscribe(
      (response) => {
        this.chat.emit(response);
      },
      (error) => {
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
      this.notificationService.showError(
        error?.originalError?.error?.message || 'Not Found',
        error?.originalError?.status
      );
    else this.notificationService.showError('Something went wrong!', '500');
  }
}
