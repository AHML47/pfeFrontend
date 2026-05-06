import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Category, CategoryFormData } from '../../../../shared/models/category.model';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {

  categories$!: Observable<Category[]>;
  error: string | null = null;

  showForm = false;
  editingCategory: Category | null = null;

  formNom = '';
  formDescription = '';
  formParentId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categories$ = this.categoryService.getAll().pipe(
      catchError(() => {
        this.error = 'Erreur de chargement';
        return of([]);
      })
    );
  }

  openCreate(): void {
    this.resetForm();
    this.showForm = true;
  }

  openEdit(category: Category): void {
    this.editingCategory = category;

    this.formNom = category.nom;
    this.formDescription = category.description ?? '';
    this.formParentId = category.parentId ?? null;

    this.showForm = true;
  }

  submitForm(): void {
    if (!this.formNom.trim()) {
      this.error = 'Nom obligatoire';
      return;
    }

    const payload: CategoryFormData = {
      nom: this.formNom,
      description: this.formDescription,
      parentId: this.formParentId
    };

    const request$ = this.editingCategory
      ? this.categoryService.update(this.editingCategory.id, payload)
      : this.categoryService.create(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cette catégorie ?')) return;

    this.categoryService.delete(id).subscribe({
      next: () => this.load()
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.editingCategory = null;
    this.formNom = '';
    this.formDescription = '';
    this.formParentId = null;
    this.error = null;
  }
}