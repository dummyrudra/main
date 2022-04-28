import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, take } from 'rxjs';
import { BadInput } from 'src/app/common/bad-input';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories$: Observable<any>;
  product: any = { category: { _id: '' } };
  public id: string;
  badInputError: string = '';

  productSubscription: Subscription = new Subscription();

  constructor(
    private categoriesService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private location: Location
  ) {
    this.categories$ = this.categoriesService.getAll();
    this.id = this.route.snapshot.params['id'];

    if (this.id)
      this.productSubscription = this.productService.getById(this.id).subscribe(
        (product: any) => {
          this.product = product || {};
        },
        (error) => {
          this.notification.showError(
            error?.originalError?.error?.message,
            error?.originalError?.status
          );
          this.router.navigateByUrl('oshop/admin/products/new');
        }
      );
  }

  ngOnInit(): void {}

  save(form: any) {
    this.badInputError = '';
    if (this.id) {
      this.productService.update(this.id, form).subscribe(
        (response) => {
          this.notification.showSuccess('Product successfully updated', '');
          this.router.navigateByUrl('oshop/admin/products');
        },
        (error) => {
          if (error instanceof BadInput) {
            this.badInputError = error?.originalError?.error?.message;
            return;
          }

          this.notification.showError(
            error?.originalError?.error?.message,
            error?.originalError?.status
          );
          // this.router.navigateByUrl('oshop/admin/products');
        }
      );
    } else {
      this.productService.create(form).subscribe(
        (response) => {
          this.notification.showSuccess('Product successfully added', '');
          this.router.navigateByUrl('oshop/admin/products');
        },
        (error) => {
          if (error instanceof BadInput) {
            this.badInputError = error?.originalError?.error?.message;
            return;
          }

          this.notification.showError(
            error?.originalError?.error?.message,
            error?.originalError?.status
          );
          // this.router.navigateByUrl('oshop/admin/products');
        }
      );
    }
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }

  delete(productId: string) {
    if (!confirm('Are you sure you want to delete this product')) return;
    this.productService.delete(productId).subscribe(
      (response) => {
        this.notification.showSuccess('Product successfully deleted', '');
        this.router.navigateByUrl('oshop/admin/products');
      },
      (error) => {
        this.notification.showError(
          error?.originalError?.error?.message,
          error?.originalError?.status
        );
        this.router.navigateByUrl('oshop/admin/products');
      }
    );
  }

  back() {
    this.location.back();
  }
}
