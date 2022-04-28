import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private db: AngularFireDatabase) {}

  create() {
    return this.db
      .list('/shopping-carts/')
      .push({ dateCreated: new Date().getTime() });
  }

  private getCart(cartId: string) {
    return this.db.list('/shopping-carts/' + cartId);
  }

  private getItem(productId: string, cartId: string) {
    return this.db.list('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId || '';

    let result = await this.create();

    localStorage.setItem('cartId', result.key || '');
    return result.key || '';
  }

  async addProductToCart(product: any) {
    let cartId = await this.getOrCreateCartId();

    let item$ = this.getItem(cartId, product.key).snapshotChanges();

    item$.subscribe((result) => {});
  }
}
