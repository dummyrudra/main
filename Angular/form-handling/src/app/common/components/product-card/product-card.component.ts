import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShoppingCartService } from '../../../services/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: any = {};
  @Input('shopping-cart') shoppingCart: any = {};
  @Input('showActions') showActions: boolean = true;
  showLoader: boolean = false;

  constructor(private cartService: ShoppingCartService) {}

  ngOnInit(): void {}

  getQuantity(): number {
    if (!this.shoppingCart) return 0;
    let item = this.shoppingCart?.items?.find(
      (item: any) => item?.product?._id === this.product?._id
    );

    return item ? item?.quantity : 0;
  }

  addToCart(action: string) {
    this.showLoader = true;
    let cartId = localStorage.getItem('cartId');
    this.cartService
      .update(cartId || this.product?._id, {
        product: this.product?._id,
        action,
      })
      .subscribe(
        (response) => {
          this.shoppingCart = response.body;
          if (action === 'add')
            this.cartService.shoppingCartItemCount.next(
              this.cartService.shoppingCartItemCount.getValue() + 1
            );
          else {
            if (this.cartService.shoppingCartItemCount.getValue() > 0)
              this.cartService.shoppingCartItemCount.next(
                this.cartService.shoppingCartItemCount.getValue() - 1
              );
          }

          if (!cartId) {
            localStorage.setItem(
              'cartId',
              JSON.parse(JSON.stringify(response?.body))?._id
            );
          }
          this.showLoader = false;
        },
        (error) => {
          this.showLoader = false;
        }
      );
  }
}
