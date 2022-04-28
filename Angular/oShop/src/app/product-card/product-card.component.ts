import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from '../services/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: any = {};
  @Input('showActions') showActions: boolean = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  addToCart(product: any) {
    this.cartService.addProductToCart(product);
  }
}
