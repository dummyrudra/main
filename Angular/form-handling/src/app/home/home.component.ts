import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PostsService } from '../services/posts.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UnauthorisedError } from '../common/unauthorised-error';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { Subscription } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  imageUrl: string;
  currentUser: any;
  posts: any;
  showLoader: boolean = true;
  postsSubscription: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private postService: PostsService,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getLoggedInUser();

    this.postsSubscription = this.postService.getAll().subscribe(
      (response) => {
        this.showLoader = false;
        this.posts = response;
      },
      (error) => {
        this.showLoader = false;
        this.handleError(error);
      }
    );
  }
  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
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
