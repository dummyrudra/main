import { Component, Input, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css'],
})
export class ProductFilterComponent implements OnInit {
  categories: any = [];
  @Input('category') category: string = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe((categories) => {
      this.categories = categories;

      if (!this.categories.some((c: any) => c.key === this.category)) {
        this.category = '';
      }
    });
  }
}
