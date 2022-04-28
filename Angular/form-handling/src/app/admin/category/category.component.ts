import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BadInput } from 'src/app/common/bad-input';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnauthorisedError } from 'src/app/common/unauthorised-error';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  categories: any = [];
  filteredCategories: any = [];
  form: any;
  selectedCategory: any;

  categoriesSubscription: Subscription = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    // this.subscription = this.categoryService.getAll().subscribe((categories) => {
    //   this.filteredCategories = this.categories = categories;
    // });
    this.form = fb.group({
      name: fb.control('', [Validators.required]),
    });
  }

  get name() {
    return this.form.get('name');
  }

  ngOnInit(): void {
    this.categoriesSubscription = this.categoryService.getAll().subscribe(
      (categories) => {
        this.filteredCategories = this.categories = categories;
      },
      (error) => {
        this.notificationService.showError(
          error?.originalError?.error?.name,
          error?.originalError?.status
        );
      }
    );
    // this.filteredCategories = this.categoryService.getAll();
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  // ngOnDestroy(): void {
  //   // this.subscription.unsubscribe();

  // }
  filter(query: string) {
    query
      ? (this.filteredCategories = this.categories.filter((category: any) =>
          category.name.toLowerCase().includes(query.toLowerCase())
        ))
      : (this.filteredCategories = this.categories);

    this.filteredCategories = [...this.filteredCategories];
  }

  selectCategory(category: any) {
    this.form.reset();
    this.selectedCategory = category;
  }

  removeSelectedCategory() {
    this.selectedCategory = {};
    this.form.reset();
  }

  addCategory(): void {
    if (!this.form.valid) return;
    this.categories.push({ name: this.form.get('name').value });

    this.filteredCategories = this.categories = [...this.categories];

    this.categoryService
      .create({ name: this.form.get('name').value })
      .subscribe(
        (response) => {
          this.categories[this.categories.length - 1] = response;
          this.filteredCategories = this.categories = [...this.categories];

          this.form.reset();
        },
        (error) => {
          this.categories.pop();
          this.filteredCategories = this.categories = [...this.categories];

          this.form.reset();
          this.handleError(error);
        }
      );
  }

  updateCategory() {
    if (!this.form.valid) return;

    let prevData = {
      name: this.selectedCategory?.name.toLowerCase(),
    };

    let newData = { name: this.form.get('name').value?.toLowerCase() };

    if (JSON.stringify(newData) === JSON.stringify(prevData)) return;

    let index = this.categories.findIndex(
      (u: any) => u?._id === this.selectedCategory._id
    );

    this.categories[index] = {
      ...this.categories[index],
      ...newData,
    };
    this.filteredCategories = this.categories = [...this.categories];

    this.form.reset();

    this.categoryService
      .update(this.selectedCategory?._id, { name: newData?.name })
      .subscribe(
        (response) => {
          this.notificationService.showSuccess(
            'Category successfully updated',
            ''
          );
          this.categories[index] = response.body;
          this.filteredCategories = this.categories = [...this.categories];

          this.selectedCategory = '';
        },
        (error) => {
          this.selectedCategory = '';
          this.categories[index] = {
            ...this.categories[index],
            ...prevData,
          };
          this.filteredCategories = this.categories = [...this.categories];

          // this.localPostImageUrl = '';

          this.handleError(error);
        }
      );
  }

  delete(category: any) {
    if (!confirm('Are you sure you want to delete this category')) return;

    let index = this.categories?.findIndex(
      (c: any) => c?._id === category?._id
    );

    this.categories.splice(index, 1);
    this.filteredCategories = this.categories = [...this.categories];

    this.categoryService.delete(category?._id).subscribe(
      (response) => {
        this.notificationService.showSuccess(
          'Category successfully deleted',
          ''
        );
      },
      (error) => {
        this.categories.splice(index, 0, category);
        this.filteredCategories = this.categories = [...this.categories];

        this.handleError(error);
      }
    );
  }

  handleError(error: any) {
    if (
      error instanceof UnauthorisedError ||
      error instanceof BadInput ||
      error instanceof NotFoundError
    )
      this.notificationService.showError(
        error?.originalError?.error?.message || 'Not Found',
        error?.originalError?.status
      );
    else this.notificationService.showError('Something went wrong!', '500');
  }
}
