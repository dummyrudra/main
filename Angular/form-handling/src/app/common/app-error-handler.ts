import { ErrorHandler } from '@angular/core';
import { NotificationService } from '../services/notification.service';

export class AppErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error: any) {
    // this.toastr.showError('Something went wrong!', '500');
    console.log(error);
  }
}
