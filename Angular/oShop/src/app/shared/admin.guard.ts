import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, switchMap, of } from 'rxjs';
import { AppUser } from '../models/app-user';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) return of(false);
        return this.userService.get(user?.uid).pipe(
          map((appUser) => {
            if (!appUser) return false;
            return appUser?.isAdmin;
          })
        );
      })
    );
  }
}
