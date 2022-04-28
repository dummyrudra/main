import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css'],
})
export class ProductFilterComponent implements OnInit {
  categories: any = [];
  @Input('category') category: string = '';

  constructor(private categoriesService: CategoryService) {}

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe((categories) => {
      this.categories = categories;

      if (!this.categories.some((c: any) => c._id === this.category)) {
        this.category = '';
      }
    });
  }
}
