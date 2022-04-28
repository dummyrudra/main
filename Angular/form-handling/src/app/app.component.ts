import { Component, EventEmitter } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedNav: any = { id: 2, name: 'Reactive' };
  title = 'form-handling';
  switchTab(e: any) {
    this.selectedNav = e;
  }

  constructor(private loadingBar: LoadingBarService) {}

  onActivate(event: Event) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
