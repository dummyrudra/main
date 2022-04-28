import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AppUser } from '../models/app-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFireDatabase) {}

  save(user: firebase.User | null) {
    this.db
      .object('/users/' + user?.uid)
      .update({ name: user?.displayName, email: user?.email });
  }

  get(uid: string): Observable<AppUser | null> {
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }
}
