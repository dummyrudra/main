import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export class ToDoFormComponent {
  form: any;
  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      name: fb.control('', Validators.required),
      email: fb.control(''),
    });
  }
}
