import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-course-form',
  templateUrl: './new-course-form.component.html',
  styleUrls: ['./new-course-form.component.css'],
})
export class NewCourseFormComponent implements OnInit {
  form: any;

  constructor(private fb: FormBuilder) {
    // this.form = new FormGroup({
    //   topics: new FormArray([])

    // })
    // this.form = fb.group({
    //   topics:fb.array([])
    // });

    this.form = fb.group({
      name: fb.control('', [Validators.required]),
      account: fb.group({
        email: fb.control('', []),
        phone: fb.control('', []),
      }),
      topics: fb.array([]),
    });
  }

  get topics() {
    return this.form.get('topics') as FormArray;
  }

  addNewTopic(topic: HTMLInputElement) {
    if (
      this.topics
        .getRawValue()
        .find(
          (val) => val.trim().toLowerCase() === topic.value.trim().toLowerCase()
        )
    ) {
      return this.form.controls['topics'].setErrors({
        topicAlreadyAdded: true,
      });
    }
    if (topic.value.length > 0) {
      this.topics.push(new FormControl(topic.value, [Validators.required]));
      topic.value = '';
    }
  }

  removeTopic(topic: AbstractControl) {
    let index = this.topics.controls.indexOf(topic);

    setTimeout(() => this.topics.removeAt(index), 400);
  }
  ngOnInit(): void {}

  submit() {}
}
