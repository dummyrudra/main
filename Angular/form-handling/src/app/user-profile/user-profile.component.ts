import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PostsService } from '../services/posts.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../services/socket.service';
import { UnauthorisedError } from '../common/unauthorised-error';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: any;
  imageUrl: string;
  currentUser: any;
  posts: any;
  showLoader: boolean = true;
  postsSubscription: Subscription = new Subscription();
  userSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    private auth: AuthService,
    private postService: PostsService,
    private socket: SocketService,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getLoggedInUser();

    this.userSubscription = this.route.data.subscribe(
      (response) => {
        this.user = response['userData'];
        // console.log(this.route.snapshot.params['id']);
        // console.log(this.route.snapshot.paramMap.get('id'));

        // this.route.paramMap.subscribe((param) => console.log(param));

        // let friend = this.user?.friends.find(
        //   (f: any) => f?.user?._id === this.currentUser?._id
        // );
        this.friendStatus();
        this.postsSubscription = this.postService
          .getByUserId(this.user?._id)
          .subscribe(
            (response) => {
              this.showLoader = false;
              this.posts = response;
            },
            (error) => {
              this.showLoader = false;
              this.handleError(error);
            }
          );
      },
      (error) => {
        this.showLoader = false;
        this.handleError(error);
      }
    );

    // this.socket.joinRoom(this.currentUser?._id);

    // this.route.paramMap.subscribe(
    //   (params) => {
    //     let id = params.get('id');
    //     this.service.getById(id).subscribe(
    //       (response) => {
    //         this.user = response;

    //         // let friend = this.user?.friends.find(
    //         //   (f: any) => f?.user?._id === this.currentUser?._id
    //         // );
    //         this.friendStatus();
    //       },
    //       (error) => {
    //         this.handleError(error);
    //       }
    //     );

    // this.postService.getByUserId(id).subscribe(
    //   (response) => {
    //     this.showLoader = false;
    //     this.posts = response;
    //   },
    //   (error) => {
    //     this.showLoader = false;
    //     this.handleError(error);
    //   }
    // );
    //   },
    //   (error) => {
    //     this.handleError(error);
    //   }
    // );

    this.socket.OnFriendRequest().subscribe((response: any) => {
      if (this.user?._id === response?._id) {
        this.user = response;
        this.friendStatus();
      }
    });
    this.socket.OnCancelRequest().subscribe((response: any) => {
      if (this.user?._id === response?._id) {
        this.user = response;
        this.friendStatus();
      }
    });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  addNewPost(event: Event) {
    this.posts.unshift(event);
    this.toastr.success('Successfully Posted!', '', {
      progressBar: true,
      closeButton: true,
      onActivateTick: false,
      timeOut: 500,
    });
  }

  handleFriendRequest(user: any, status?: string) {
    if (
      (user?.status === 'Send Request' || user?.status === 'sent') &&
      !status
    ) {
      this.service.addFriend(user._id).subscribe(
        (response) => {
          this.user = response;
          this.friendStatus();
          return;
        },
        (error) => {
          this.handleError(error);
        }
      );
    }

    if (
      user?.status === 'Remove Friend' ||
      user?.status === 'Cancel Request' ||
      status
    ) {
      this.service.cancelFriend(user._id).subscribe(
        (response) => {
          this.user = response;
          this.friendStatus();
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  friendStatus() {
    let friend = this.user?.friends.find(
      (f: any) => f?.user?._id === this.currentUser?._id
    );

    if (this.currentUser) {
      if (friend && friend?.status) {
        if (friend.status === 'pending') {
          this.user.status = 'Cancel Request';
        } else if (friend.status === 'sent') {
          this.user.status = 'sent';
        } else if (friend.status === 'requested') {
          this.user.status = 'Cancel Request';
        } else if (friend.status === 'success') {
          this.user.status = 'Remove Friend';
        }
      } else {
        if (this.user) this.user.status = 'Send Request';
      }
    }
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
          timeOut: 500,
        }
      );
    else
      this.toastr.error('Something went wrong!', '500', {
        progressBar: true,
        closeButton: true,
        timeOut: 500,
      });
  }
}
