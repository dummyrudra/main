import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  products: any = [];
  filteredProducts: any = [];
  productsSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {
    // this.subscription = this.productService.getAll().subscribe((products) => {
    //   this.filteredProducts = this.products = products;
    // });
  }

  ngOnInit(): void {
    this.productsSubscription = this.productService.getAll().subscribe(
      (products) => {
        this.filteredProducts = this.products = products;
      },
      (error) => {
        this.notificationService.showError(
          error?.originalError?.error?.message,
          error?.originalError?.status
        );
      }
    );
    // this.filteredProducts = this.productService.getAll();
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

  // ngOnDestroy(): void {
  //   // this.subscription.unsubscribe();

  // }
  filter(query: string) {
    query
      ? (this.filteredProducts = this.products.filter((product: any) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        ))
      : (this.filteredProducts = this.products);
  }
}
