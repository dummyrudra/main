import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { ProductService } from '../services/product.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any = [];
  filteredProducts: any = [];
  category: string = '';
  searchQuery: string = '';

  itemsPerPage: number = 6;
  currentPage: number = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.productService
      .getAll()
      .pipe(
        switchMap((products) => {
          this.filteredProducts = this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe((params) => {
        this.category = params.get('category') || '';

        this.filteredProducts = this.products.filter(
          (p: any) => p.category === this.category
        );
        if (this.filteredProducts.length === 0)
          this.filteredProducts = this.products;
      });
  }

  ngOnInit(): void {}

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
}
