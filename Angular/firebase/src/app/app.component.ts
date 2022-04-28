import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'firebase';
  courses$: Observable<any>;
  course$: Observable<any>;
  // courses: any = [];
  // subscription: Subscription;

  constructor(private db: AngularFireDatabase) {
    this.courses$ = db.list('/courses').valueChanges();
    this.course$ = db.object('/courses/1').valueChanges();
    // this.subscription = db
    //   .list('/courses')
    //   .snapshotChanges()
    //   .subscribe((data) => {
    //     this.courses = data;
    //     console.log(
    //       data.map((d) => {
    //         return { key: d.payload.key, value: d.payload.val() };
    //       })
    //     );
    //   });
    // .snapshotChanges()
    // .subscribe((data) => {
    //   this.courses$ = data;
    // });
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}
