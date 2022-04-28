import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { EmailValidators } from './email.validators';
import { UsernameValidators } from './username.validators';
import { AlreadyExistsError } from '../common/already-exists-error';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import {
  ImageCroppedEvent,
  LoadedImage,
  base64ToFile,
} from 'ngx-image-cropper';

@Component({
  selector: 'signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
})
export class SignupFormComponent implements OnInit {
  form: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper: boolean = false;
  constructor(
    private service: UserService,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email, Validators.maxLength(40)]
        // [new EmailValidators(this.http).shouldBeUnique]
      ),
      password: new FormControl('', [
        Validators.required,
        UsernameValidators.canNotContainSpace,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]),
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', []),
      // address:new FormGroup({
      //   district:new FormControl('',[Validators.required]),
      //   state:new FormControl('',[Validators.required])
      // })
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

  get district() {
    return this.form.get('address.district');
  }

  get state() {
    return this.form.get('address.state');
  }

  ngOnInit(): void {}

  onFileSelect(event: any) {
    this.fileChangeEvent(event);
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!allowedExtensions.includes(file.type)) {
        event.target.value = '';
        return this.form.controls['file'].setErrors({
          invalidFileExtension: true,
        });
      }
      // this.form.patchValue({ fileSource: file });
    }
  }
  submit() {
    let formData = new FormData();

    formData.append('name', this.form.get('name').value);
    formData.append('email', this.form.get('email').value);
    formData.append('password', this.form.get('password').value);
    formData.append('file', this.form.get('fileSource').value);

    if (this.form.valid) {
      this.service.create(formData).subscribe(
        (response) => {
          let res = JSON.stringify(response);
          if (JSON.parse(res)?.status === 200) {
            this.auth.updateToken(JSON.parse(res)?.token);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          if (error instanceof AlreadyExistsError) {
            this.form.controls['email'].setErrors({ emailAlreadyTaken: true });
          } else {
            this.toastr.error('Something went wrong!', '', {
              progressBar: true,
              closeButton: true,
              timeOut: 500,
            });
          }
        }
      );
    }
  }
}
