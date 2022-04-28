import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { UnauthorisedError } from '../../unauthorised-error';
import { BadInput } from '../../bad-input';
import { NotFoundError } from '../../not-found-error';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @Input('posts') posts: any;
  @Input('user') user: any;
  @Input('currentUser') currentUser: any;
  form: any;
  selectedPost: any;
  likedBy: any;
  selectedPostImageUrl: string = '';

  images: any = [];
  postImages: any = [];

  // posts: any = [];
  imageUrl: string;
  postImageUrl: string;

  itemsPerPage: number = 5;
  currentPage: number = 1;

  constructor(
    private service: PostsService,
    fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl;
    this.postImageUrl = environment.postImageUrl;
    this.selectedPostImageUrl = environment.postImageUrl;

    this.form = fb.group({
      message: fb.control(''),
      postFile: fb.control(''),
      fileSource: fb.control(''),
    });
  }

  get message() {
    return this.form.get('message');
  }

  get postFile() {
    return this.form.get('postFile');
  }

  ngOnInit(): void {
    // this.service.getById(this.user?._id).subscribe((response) => {
    //   this.posts = response;
    // });
  }

  deletePost(post: any) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.service.delete(post._id).subscribe(
          (response) => {
            let index = this.posts.findIndex((p: any) => p._id === post._id);
            this.posts.splice(index, 1);

            this.toastr.success('Post successfully deleted', '', {
              progressBar: true,
              closeButton: true,
              onActivateTick: false,
              timeOut: 500,
            });
          },
          (error: Response) => {
            this.handleError(error);
          }
        );
      }
    });
  }

  isLiked(likes: any): boolean {
    if (likes?.find((u: any) => u?._id === this.currentUser?._id)) return true;
    else return false;
  }

  isFriendsLiked(likes: any) {
    // console.log(likes);
    let likedByFriends = likes?.filter((u: any) =>
      u?.friends?.find((f: any) => f?.user === this.currentUser?._id)
    );
    // console.log(likedByFriends);
    if (likedByFriends.length > 0) {
      if (likedByFriends.length === 1) {
        return [{ name: likedByFriends[0]?.name }];
      } else
        return [
          { name: likedByFriends[0]?.name },
          { name: likedByFriends[1]?.name },
        ];
    }

    return [];
  }

  toggleComments(post: any) {
    let index = this.posts.findIndex((p: any) => p._id === post._id);
    if (index !== -1) this.posts[index] = post;
  }

  toggleLikePost(isLiked: any, post: any) {
    if (!this.currentUser?._id) {
      this.toastr.warning('', 'Login to like post!', {
        progressBar: true,
        closeButton: true,
        timeOut: 500,
      });
      return;
    }
    if (isLiked) {
      let index = this.posts.findIndex((p: any) => p._id === post._id);
      if (index !== -1) {
        this.posts[index].likes.push(this.currentUser);
      }
    } else {
      let index = this.posts.findIndex((p: any) => p._id === post._id);
      if (index !== -1) {
        this.posts[index].likes = this.posts[index].likes.filter(
          (u: any) => u?._id !== this.currentUser?._id
        );
      }
    }

    this.service.likePost(post._id).subscribe(
      (response) => {
        // let index = this.posts.findIndex((p: any) => p._id === post._id);
        // if (index !== -1) {
        //   this.posts[index].likes = JSON.parse(JSON.stringify(response))?.likes;
        // }
      },
      (error) => {
        this.handleError(error);
        if (!isLiked) {
          let index = this.posts.findIndex((p: any) => p._id === post._id);
          if (index !== -1) {
            this.posts[index].likes.push(this.currentUser);
          }
        } else {
          let index = this.posts.findIndex((p: any) => p._id === post._id);
          if (index !== -1) {
            this.posts[index].likes.splice(this.currentUser);
          }
        }
      }
    );
  }

  toggleLikedBy(post: any) {
    this.likedBy = post.likes;
  }

  selectPost(post: any) {
    this.selectedPost = post;

    this.form.controls['message'].value = post?.message || '';
    this.form.controls['postFile'].value = post?.postFile;
    this.form.controls['fileSource'].value = '';

    this.form.controls['message'].setErrors();
    this.form.controls['postFile'].setErrors();
    this.form.controls['fileSource'].setErrors();
  }

  onFileSelect(event: any) {
    this.images = [];
    this.postImages = [];
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files && event.target.files[0]) {
      // const file = event.target.files[0];

      for (let i = 0; i < event.target.files.length; i++) {
        if (allowedExtensions.includes(event.target.files[i].type)) {
          //  event.target.value = '';
          //  this.localPostImageUrl = '';
          //  return this.form.controls['postFile'].setErrors({
          //    invalidFileExtension: true,
          //  });
          if (this.images.length < 10) {
            this.images.push(URL.createObjectURL(event.target.files[i]));
            this.postImages.push(event.target.files[i]);
          }
        }
      }
      if (this.images.length === 0) {
        event.target.value = '';
        // this.localPostImageUrl = '';
        return this.form.controls['postFile'].setErrors({
          invalidFileExtension: true,
        });
      }
      // this.form.patchValue({ fileSource: file });
      // this.localPostImageUrl = URL.createObjectURL(event.target.files[0]);
      this.form.controls['postFile'].touched = true;
    }
  }

  updatePostImageUrl(url: string) {
    // this.localPostImageUrl = url;
    this.images = [];
    this.postImages = [];
    this.selectedPost = '';
  }

  updatePost() {
    if (!this.form.valid || !this.currentUser?._id) return;

    let formData = new FormData();
    formData.append('message', this.form.get('message').value);

    // if (this.form.get('fileSource').value)
    //   formData.append('postFile', this.form.get('fileSource').value);

    let newData = {
      message: this.form.get('message').value,
      postFile: this.form.get('postFile').value,
    };

    let prevData = {
      message: this.selectedPost?.message || '',
      postFile: this.selectedPost?.postFile,
    };

    if (JSON.stringify(newData) === JSON.stringify(prevData)) return;

    for (let file of this.postImages) {
      formData.append('postFile', file);
    }

    let index = this.posts.findIndex(
      (u: any) => u._id === this.selectedPost._id
    );

    delete newData?.postFile;

    this.posts[index] = {
      ...this.posts[index],
      ...newData,
    };

    this.form.reset();
    this.selectedPost = '';

    this.service.update(this.posts[index]?._id, formData).subscribe(
      (response) => {
        this.toastr.success('Post successfully updated', '', {
          progressBar: true,
          closeButton: true,
          onActivateTick: false,
          timeOut: 500,
        });
        this.posts[index].postFile = JSON.parse(
          JSON.stringify(response.body)
        )?.postFile;
        this.images = [];
        this.postImages = [];
        // this.localPostImageUrl = '';
      },
      (error) => {
        this.posts[index] = { ...this.posts[index], ...prevData };
        // this.localPostImageUrl = '';
        this.images = [];
        this.postImages = [];
        this.handleError(error);
      }
    );
  }

  deletePostImage(file: any) {
    let index = this.images.indexOf(file);
    this.images.splice(index, 1);
    this.postImages.splice(index, 1);
  }

  copied() {
    this.toastr.success('copied to clipboard', '', {
      timeOut: 500,
      progressBar: true,
      closeButton: true,
      onActivateTick: false,
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

  pageChanged(event: any) {
    this.currentPage = event;
  }

  // searchPost(input: HTMLInputElement) {
  //   let keyup = fromEvent(input, 'keyup');
  //   keyup
  //     .pipe(
  //       filter(Boolean),
  //       debounceTime(400)
  //       // distinctUntilChanged(),
  //     )
  //     .subscribe((result) => {
  //       this.service.getAll(input.value).subscribe(
  //         (response) => {
  //           this.posts = response;
  //         },
  //         (error) => {
  //           this.handleError(error);
  //         }
  //       );
  //     });
  // }
}
