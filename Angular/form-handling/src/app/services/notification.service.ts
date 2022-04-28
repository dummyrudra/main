import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string) {
    this.toastr.success(message, title, {
      timeOut: 1000,
      tapToDismiss: true,
      progressBar: true,
      closeButton: true,
      onActivateTick: false,
    });
  }
  showWarning(message: string, title: string) {
    this.toastr.warning(message, title);
  }
  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }
  showInfo(message: string, title: string) {
    this.toastr.info(message, title);
  }
}
