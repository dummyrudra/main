import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService extends DataService {
  shoppingCartItemCount = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient) {
    super(environment.apiUrl + 'shopping-carts', httpClient);
  }

  getCart() {
    let cartId = localStorage.getItem('cartId');
    if (!cartId)
      return this.httpClient.post(environment.apiUrl + 'shopping-carts/', {});

    return this.httpClient.get(environment.apiUrl + 'shopping-carts/' + cartId);
  }
}
