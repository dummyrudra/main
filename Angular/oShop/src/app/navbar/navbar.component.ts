import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/compat/app';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';
import { AppUser } from '../models/app-user';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // user$: Observable<firebase.User | null>;
  appUser: AppUser | null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    // this.user$ = this.authService.user$.pipe(map((user) => user));
    authService.appUser$.subscribe((user) => {
      this.appUser = user;
    });
    this.appUser = { name: '', email: '', isAdmin: false };
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
