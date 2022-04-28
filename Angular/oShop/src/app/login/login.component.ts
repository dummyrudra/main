import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userService.save(user);
        this.router.navigateByUrl(
          this.route.snapshot.queryParams['returnUrl'] || ''
        );
      }
    });
  }

  login() {
    this.authService.login();
  }
}
