import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart: any;
  totalPrice: number = 0;

  cartSubscription: Subscription = new Subscription();

  constructor(private cartService: ShoppingCartService) {
    this.cartSubscription = this.cartService.getCart().subscribe((response) => {
      this.cart = response;
      this.totalPrice = 0;
      for (let item of this.cart?.items) {
        this.totalPrice += item.quantity * item?.product?.price;
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
