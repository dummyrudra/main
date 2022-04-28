import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BadInput } from 'src/app/common/bad-input';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnauthorisedError } from 'src/app/common/unauthorised-error';
import { ConversationService } from 'src/app/services/conversation.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'chats-card',
  templateUrl: './chats-card.component.html',
  styleUrls: ['./chats-card.component.css'],
})
export class ChatsCardComponent implements OnInit, OnDestroy {
  @Input('friend') friend: any = {};
  @Input('currentUser') currentUser: any = {};
  chats: any = [];
  imageUrl: string = '';
  conversationSubscription: Subscription = new Subscription();
  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private conversationService: ConversationService,
    private notificationService: NotificationService,
    private socket: SocketService
  ) {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.socket.OnReceiveMessage().subscribe((response: any) => {
      this.chats.push(response);
      setTimeout(() => {
        this.scrollToBottom();
      }, 10);
      // this.chatBody.scrollIntoView({ behavior: 'smooth' });
    });
  }

  ngOnChanges(): void {
    if (this.friend?._id)
      this.conversationSubscription = this.conversationService
        .getById(this.friend?.user?._id)
        .subscribe(
          (response) => {
            this.chats = response;
            setTimeout(() => {
              this.scrollToBottom();
            }, 10);
          },
          (error) => {
            this.handleError(error);
          }
        );
  }

  scrollToBottom() {
    this.chatBody?.nativeElement.scrollTo({
      left: 0,
      top: this.chatBody.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  ngOnDestroy(): void {
    this.conversationSubscription.unsubscribe();
  }

  sendMessage(message: any): void {
    this.chats.push(message);
    setTimeout(() => {
      this.scrollToBottom();
    }, 10);
    // this.chatBody.nativeElement.scrollTo({
    //   left: 0,
    //   top: this.chatBody.nativeElement.scrollHeight + 100,
    //   behavior: 'smooth',
    // });
    // this.el.nativeElement.scrollIntoView({ behavior: 'smooth' });
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

  clearChat(message?: any) {
    if (
      !confirm(
        'Are you sure you want to ' +
          (message?._id ? 'delete this message ?' : 'clear chat ?')
      )
    )
      return;
    let id;
    let index: number;
    let chats: any = [];
    if (!message?._id) {
      id = this.chats[0]?.conversation;
      chats = this.chats;
      this.chats = [];
    } else {
      id = message?._id;
      index = this.chats.indexOf(message);
      this.chats.splice(index, 1);
    }

    if (id) {
      this.conversationService.delete(id).subscribe(
        (response) => {
          this.notificationService.showSuccess(
            JSON.parse(JSON.stringify(response))?.message,
            '200'
          );
        },
        (error) => {
          if (message?._id) this.chats.splice(index, 0, message);
          else this.chats = chats;
          this.handleError(error);
        }
      );
    } else {
      this.notificationService.showInfo('There is no Messages to clear!', '');
    }
  }

  updateWallpaper() {
    this.conversationService.updatePatch(this.friend?._id).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => this.handleError(error)
    );
  }
}
