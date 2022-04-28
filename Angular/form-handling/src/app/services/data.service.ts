import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { AuthService } from '../shared/auth.service';
import { AlreadyExistsError } from '../common/already-exists-error';
import { UnauthorisedError } from '../common/unauthorised-error';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })

export interface data {}
export class DataService implements Resolve<data> {
  //   private url="https://jsonplaceholder.typicode.com/posts";

  constructor(
    private url: string,
    private http: HttpClient,
    private authService?: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.http
      .get(this.url + '/' + route.paramMap.get('id'), {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  getAll(searchQuery?: any) {
    //   if (!searchQuery) {
    //     searchQuery = '';
    //   }
    //   let params = new HttpParams();
    //   if(searchQuery.searchQuery)
    //   params =  params.append('searchQuery',searchQuery?.searchQuery);
    // if(searchQuery.userType)
    //   params = params.append('userType',searchQuery?.userType);
    // if(searchQuery.userStatus)
    //   params = params.append('userStatus',searchQuery?.userStatus);

    //   console.log(searchQuery)

    return this.http
      .get(this.url, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
        params: searchQuery,
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  getById(id: any) {
    return this.http
      .get(this.url + '/' + id, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  getByUserId(id: any) {
    return this.http
      .get(this.url + '/user/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  create(resource: any) {
    return this.http
      .post(this.url, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }
  createById(id: any, resource: any) {
    return this.http
      .post(this.url + '/' + id, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)))
      .toPromise();
  }

  likePost(postId: string) {
    return this.http
      .post(
        this.url + '/toggleLike',
        { post: postId },
        {
          headers: {
            ['x-auth-token']: localStorage.getItem('authToken') || '',
          },
        }
      )
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  updatePatch(resource: any) {
    return this.http
      .patch(
        this.url + '/' + resource.id,
        { isRead: resource.isRead },
        {
          headers: {
            ['x-auth-token']: localStorage.getItem('authToken') || '',
          },
        }
      )
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  update(id: any, resource: any) {
    return this.http
      .put(this.url + '/' + id, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
        observe: 'response',
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  delete(id: any) {
    return this.http
      .delete(this.url + '/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  addFriend(friend: any) {
    return this.http
      .put(
        this.url + '/addFriend',
        { friend: friend },
        {
          headers: {
            ['x-auth-token']: localStorage.getItem('authToken') || '',
          },
        }
      )
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  cancelFriend(friend: any) {
    return this.http
      .put(
        this.url + '/cancelRequest',
        { friend: friend },
        {
          headers: {
            ['x-auth-token']: localStorage.getItem('authToken') || '',
          },
        }
      )
      .pipe(catchError((error: Response) => this.handleError(error)));
  }

  public handleError(error: Response) {
    if (error.status === 404) return throwError(new NotFoundError(error));
    if (error.status === 400) return throwError(new BadInput(error));
    if (error.status === 409) return throwError(new AlreadyExistsError(error));
    if (error.status === 401) return throwError(new UnauthorisedError(error));

    return throwError(new AppError(error));
  }
}
