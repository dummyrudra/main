import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from 'src/environments/environment';

export class EmailValidators {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      this.http
        .patch(environment.apiUrl + 'valid-email', { email: control.value })
        .subscribe(
          (response) => {
            resolve(null);
          },
          (error) => {
            reject(error);
          }
        );

      //   setTimeout(() => {
      //     if (control.value === 'test1@gmail.com')
      //       resolve({ shouldBeUnique: true });
      //     else resolve(null);
      //   }, 1000);
    });
  }
}
