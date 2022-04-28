import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any = [];
  filteredProducts: any = [];
  category: string = '';
  searchQuery: string = '';

  itemsPerPage: number = 6;
  currentPage: number = 1;

  cart: any = {};
  subscription: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: ShoppingCartService
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.subscription = this.productService
      .getAll()
      .pipe(
        switchMap((products) => {
          this.filteredProducts = this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe((params) => {
        this.currentPage = 1;
        this.searchQuery = '';
        this.category = params.get('category') || '';

        this.filteredProducts = this.products.filter(
          (p: any) => p.category?._id === this.category
        );
        if (this.filteredProducts.length === 0)
          this.filteredProducts = this.products;
      });
  }

  ngOnInit() {
    this.subscription = this.cartService.getCart().subscribe(
      (data) => {
        this.cart = data;
      },
      (error) => {
        localStorage.removeItem('cartId');
        this.cartService.getCart().subscribe((data) => {
          this.cart = data;
        });
      }
    );
  }

  pageChanged(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  changeItemsPerPage(value: string) {
    this.itemsPerPage = Number(value);
    this.currentPage = 1;
  }

  searchProducts() {
    this.currentPage = 1;
    this.category = '';
    this.searchQuery
      ? (this.filteredProducts = this.products.filter((product: any) =>
          product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        ))
      : (this.filteredProducts = this.products);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
