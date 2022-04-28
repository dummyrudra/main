import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductService } from 'src/app/services/product.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories$: Observable<any>;
  product: any = {};
  public id: string;
  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categories$ = this.categoriesService.getAllCategories();
    this.id = this.route.snapshot.params['id'];

    if (this.id)
      this.productService
        .getById(this.id)
        .pipe(take(1))
        .subscribe((product) => {
          this.product = product.payload.val() || {};
          if (Object.keys(this.product).length === 0)
            this.router.navigateByUrl('admin/products/new');
        });
  }

  ngOnInit(): void {}

  save(form: any) {
    if (this.id) this.productService.update(this.id, form);
    else this.productService.save(form);

    this.router.navigateByUrl('/admin/products');
  }
  ngOnDestroy() {}

  delete(productId: string) {
    if (!confirm('Are you sure you want to delete this product')) return;
    this.productService.delete(productId);
    this.router.navigateByUrl('/admin/products');
  }
}
