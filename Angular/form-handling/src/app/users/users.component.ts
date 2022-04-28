import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { SocketService } from '../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { UnauthorisedError } from '../common/unauthorised-error';
import { NotFoundError } from '../common/not-found-error';
import { BadInput } from '../common/bad-input';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: any;
  usersSubscription: Subscription = new Subscription();
  currentUser: any;
  form: any;
  selectedUser: any;
  imageUrl: string = '';
  tempUrl: string = '';
  showLoader: boolean = true;
  showApplyLoader: boolean = false;
  showResetLoader: boolean = false;
  page: number = 1;
  itemsPerPage: number = 3;

  showCropper: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private service: UserService,
    private auth: AuthService,
    fb: FormBuilder,
    private socket: SocketService,
    private toastr: ToastrService
  ) {
    this.imageUrl = environment.imageUrl;
    this.form = fb.group({
      name: fb.control('', [Validators.required, Validators.maxLength(30)]),
      email: fb.control(
        '',
        [Validators.required, Validators.email, Validators.maxLength(40)]
        // [EmailValidators.shouldBeUnique]
      ),
      file: fb.control('', [Validators.required]),
      fileSource: fb.control('', [Validators.required]),
      isAdmin: fb.control('', [Validators.required]),
      isActive: fb.control('', [Validators.required]),
    });
  }

  fileChangeEvent(event: any): void {
    this.showCropper = false;
    this.croppedImage = '';
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    let file = base64ToFile(this.croppedImage);
    this.form.patchValue({ fileSource: file });
  }
  imageLoaded() {
    this.showCropper = true;
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  get name() {
    return this.form.get('name');
  }

  get password() {
    return this.form.get('password');
  }

  get email() {
    return this.form.get('email');
  }

  get file() {
    return this.form.get('file');
  }

  get isAdmin() {
    return this.form.get('isAdmin');
  }

  get isActive() {
    return this.form.get('isActive');
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getLoggedInUser();
    // this.socket.joinRoom(this.currentUser._id);
    // console.log(this.socket);

    this.usersSubscription = this.service.getAll().subscribe(
      (response) => {
        this.showLoader = false;

        this.users = this.friendStatus(response);
      },
      (error) => {
        this.showLoader = false;
        this.handleError(error);
      }
    );

    this.socket.OnFriendRequest().subscribe((response: any) => {
      let index = this.users.findIndex((u: any) => u?._id === response?._id);
      this.users[index] = this.friendStatus([response])[0];
    });
    this.socket.OnCancelRequest().subscribe((response: any) => {
      let index = this.users.findIndex((u: any) => u?._id === response?._id);
      this.users[index] = this.friendStatus([response])[0];
    });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  friendStatus(users: any) {
    for (let item of users) {
      let friend = item.friends.find(
        (f: any) => f?.user?._id === this.currentUser._id
      );

      if (friend) {
        if (friend.status === 'pending') {
          item.status = 'Cancel Request';
        } else if (friend.status === 'sent') {
          item.status = 'sent';
        } else if (friend.status === 'requested') {
          item.status = 'Cancel Request';
        } else if (friend.status === 'success') {
          item.status = 'Remove Friend';
        }
      } else item.status = 'Send Request';
    }
    return users;
  }

  deleteUser(user: any) {
    let index = this.users.findIndex((u: any) => u?._id === user?._id);

    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.users.splice(index, 1);
        this.service.delete(user?._id).subscribe(
          (response) => {
            // let index = this.users.findIndex((u: any) => u._id === user._id);

            // this.users.splice(index, 1);

            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          },
          (error) => {
            this.users.splice(index, 0, user);
            this.handleError(error);
          }
        );
      }
    });
  }

  selectUser(user: any) {
    this.showCropper = false;
    this.croppedImage = '';
    this.selectedUser = user;

    this.form.controls['name'].value = user?.name;
    this.form.controls['email'].value = user?.email;
    this.form.controls['file'].value = user?.file;
    this.form.controls['isAdmin'].value = user?.isAdmin;
    this.form.controls['isActive'].value = user?.isActive;
    this.form.controls['fileSource'].value = '';

    this.form.controls['name'].setErrors();
    this.form.controls['email'].setErrors();
    this.form.controls['file'].setErrors();
    this.form.controls['isAdmin'].setErrors();
    this.form.controls['isActive'].setErrors();
    this.form.controls['fileSource'].setErrors();
  }

  updateUser() {
    if (!this.form.valid || !this.currentUser?._id) return;

    let formData = new FormData();
    formData.append('name', this.form.get('name').value);
    formData.append('email', this.form.get('email').value);

    if (this.form.get('fileSource').value)
      formData.append('file', this.form.get('fileSource').value);
    if (
      this.currentUser.isAdmin
      // &&
      // this.currentUser === this.selectedUser._id
    ) {
      formData.append('isActive', this.form.get('isActive').value);
      formData.append('isAdmin', this.form.get('isAdmin').value);
    }

    let newData = {
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      isActive: this.form.get('isActive').value,
      isAdmin: this.form.get('isAdmin').value,
      file: this.form.get('file').value,
    };

    let prevData = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      isActive: this.selectedUser.isActive,
      isAdmin: this.selectedUser.isAdmin,
      file: this.selectedUser.file,
    };

    if (JSON.stringify(newData) === JSON.stringify(prevData)) return;

    let index = this.users?.findIndex(
      (u: any) => u?._id === this?.selectedUser?._id
    );
    delete newData?.file;

    this.users[index] = { ...this.users[index], ...newData };
    if (this.form.get('fileSource')?.value) {
      this.tempUrl = URL.createObjectURL(this.form.get('fileSource')?.value);
      this.users[index].file = '';
    }
    this.form.reset();

    this.selectedUser = '';

    this.service.update(this.users[index]?._id, formData).subscribe(
      (response) => {
        // let index = this.users.findIndex(
        //   (u: any) => u._id === this.selectedUser._id
        // );
        // this.users[index] = this.friendStatus([response.body])[0];
        // this.form.reset();
        this.users[index].file = JSON.parse(
          JSON.stringify(response.body)
        )?.file;

        if (this.currentUser?._id === this.users[index]?._id) {
          this.auth.updateToken(response.headers.get('x-auth-token') || '');
        }
        // this.selectedUser = '';
        this.croppedImage = '';
        this.showCropper = false;
        this.tempUrl = '';
      },
      (error) => {
        this.users[index] = { ...this.users[index], ...prevData };
        this.tempUrl = '';
        // this.form.reset();
        this.croppedImage = '';
        this.showCropper = false;
        this.handleError(error);
      }
    );
  }

  updateImageUrl(url: any) {
    this.croppedImage = url;
    this.selectedUser = '';
  }

  viewUser(user: any) {
    Swal.fire({
      title: '<h1>User Details</h1>',
      html: `
      <div>
        <strong>Name:</strong>${user.name}
      </div>
      <div>
        <strong>Email:</strong>${user.email}
      </div>
      <div>
        <strong>Status:</strong>${user.isActive ? 'Active' : 'Deactive'}
      </div>
      <div>
        <strong>Role:</strong>${user.isAdmin ? 'Admin' : 'User'}
      </div>`,
      imageUrl: this.imageUrl + user.file,
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'Custom image',
    });
  }

  onFileSelect(event: any) {
    this.fileChangeEvent(event);
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
      this.form.controls['file'].touched = true;
      const file = event.target.files[0];
      if (!allowedExtensions.includes(file.type)) {
        event.target.value = '';

        return this.form.controls['file'].setErrors({
          invalidFileExtension: true,
        });
      } else {
        // this.form.patchValue({ fileSource: file });
        this.form.controls['file'].touched = true;
      }
    }
  }

  handleFriendRequest(user: any, status?: string) {
    if (
      (user?.status === 'Send Request' || user?.status === 'sent') &&
      !status
    ) {
      this.service.addFriend(user._id).subscribe(
        (response) => {
          let index = this.users.indexOf(user);

          this.users[index] = this.friendStatus([response])[0];
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
          let index = this.users.indexOf(user);
          this.users[index] = this.friendStatus([response])[0];
        },
        (error) => {
          this.handleError(error);
        }
      );
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

  pageChanged(event: any) {
    this.page = event;
  }

  manipulateData(form: any) {
    if (Object.keys(form).length > 0) this.showApplyLoader = true;
    else this.showResetLoader = true;

    let searchQuery: any = {};

    if (form?.value?.userStatus === '0' || form?.value?.userStatus === '1')
      searchQuery.userStatus = Boolean(Number(form?.value?.userStatus));

    if (form?.value?.userType === '0' || form?.value?.userType === '1')
      searchQuery.userType = Boolean(Number(form?.value?.userType));

    searchQuery.searchQuery = form?.value?.search || '';

    this.service.getAll(searchQuery).subscribe(
      (response) => {
        this.showApplyLoader = this.showResetLoader = false;
        this.page = 1;
        this.users = this.friendStatus(response);
      },
      (error) => {
        this.showApplyLoader = false;
        this.handleError(error);
      }
    );

    // if(form.value.userType==="" || form.value.userType=='All')
    //  filter1 = this.allUsers;
    // else
    //   filter1 = filter1.filter((u:any)=>u?.isAdmin===Boolean(Number(form.value.userType)))

    // if(form.value.userStatus==="" || form.value.userStatus=='All')
    //  this.users = filter1;
    // else
    //   this.users = filter1.filter((u:any)=>u?.isActive===Boolean(Number(form.value.userStatus)))
  }
}
