import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AppUser } from '../models/app-user';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;
  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState;
  }

  login() {
    this.afAuth.signInWithRedirect(new GoogleAuthProvider());
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  get appUser$(): Observable<AppUser | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user) return this.userService.get(user.uid);
        return of(null);
      })
    );
  }
}
