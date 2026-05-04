import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/models/category.model';

@Component({
  selector: 'app-category-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-user.component.html',
  styleUrls: ['./category-user.component.css']
})
export class CategoryUserComponent implements OnInit {

  categories: Category[] = [];
  loading = false;
  error = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement catégories';
        this.loading = false;
      }
    });
  }

  goToCategory(categoryName: string): void {
    this.router.navigate(['/user/products'], {
      queryParams: { category: categoryName }
    });
  }
}

