import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { Products } from 'src/app/models/products';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  products: any = [];
  filteredProducts: any = [];

  constructor(private productService: ProductService) {
    // this.subscription = this.productService.getAll().subscribe((products) => {
    //   this.filteredProducts = this.products = products;
    // });
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe((products) => {
      this.filteredProducts = this.products = products;
    });
    // this.filteredProducts = this.productService.getAll();
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
