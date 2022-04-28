import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
  contactMethods: any[] = [];

  constructor() {
    this.contactMethods = [
      { id: 1, name: 'E-mail' },
      { id: 2, name: 'Phone' },
    ];
  }

  ngOnInit(): void {}
  onSubmit(contactForm: any) {}
}
