import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, switchMap } from 'rxjs';
import { BadInput } from 'src/app/common/bad-input';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnauthorisedError } from 'src/app/common/unauthorised-error';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
})
export class ChatsComponent implements OnInit {
  userSubscription: Subscription = new Subscription();
  currentUser: any;
  friend: any = {};
  friends: any = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    let loggedInUser: any = this.authService.getLoggedInUser() || '';
    if (loggedInUser)
      this.userSubscription = this.userService
        .getById(loggedInUser?._id)
        .pipe(
          switchMap((user: any) => {
            this.currentUser = user;
            this.friends =
              this.currentUser?.friends?.filter(
                (f: any) => f?.status === 'success'
              ) || [];
            return this.route.queryParamMap;
          })
        )
        .subscribe(
          (params) => {
            let friendId = params.get('friend') || '';
            this.friend =
              this.currentUser?.friends?.find(
                (f: any) => f?.user?._id === friendId && f?.status === 'success'
              ) || {};
          },
          (error) => {
            this.handleError(error);
          }
        );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
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
