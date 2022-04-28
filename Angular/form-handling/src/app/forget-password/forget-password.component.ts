import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  form: any;
  oldPasswords: any = ['1234', '4321', '1111'];

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      oldPassword: fb.control('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      newPassword: fb.control('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      confirmPassword: fb.control('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  get oldPassword() {
    return this.form.get('oldPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  ngOnInit(): void {}

  changePassword(oldPassword: string, newPassword: string) {
    if (!(this.oldPasswords[this.oldPasswords.length - 1] === oldPassword)) {
      return this.form.controls['oldPassword'].setErrors({
        oldPasswordNotMatch: true,
      });
    }
    if (this.oldPasswords.includes(newPassword)) {
      return this.form.controls['newPassword'].setErrors({
        tryNewPassword: true,
      });
    }
    this.oldPasswords.push(newPassword);
    alert('Password Updated Successfully!');
    this.form.reset();
  }

  togglePassword(event: Event) {}
}
