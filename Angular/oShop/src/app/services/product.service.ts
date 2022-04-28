import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private db: AngularFireDatabase) {}

  getAll() {
    return this.db
      .list('/products/')
      .snapshotChanges()
      .pipe(
        map((products: any) => {
          return products.map((a: any) => {
            let obj: any = a.payload.val();
            return {
              ...obj,
              key: a.key,
            };
          });
        })
      );
  }

  getById(productId: string) {
    return this.db.object('/products/' + productId).snapshotChanges();
  }

  save(product: any) {
    return this.db.list('/products/').push(product);
  }

  update(productId: string, product: any) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId: string) {
    return this.db.object('/products/' + productId).remove();
  }
}
