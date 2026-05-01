import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Category, CategoryFormData } from '../../../../shared/models/category.model';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  loading = false;
  error = '';

  // FORM SIMPLE
  showForm = false;
  editingCategory: Category | null = null;

  formNom = '';
  formDescription = '';
  formParentId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  // LOAD
  load(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Erreur de chargement';
      }
    });
  }

  // OPEN CREATE
  openCreate(): void {
    this.resetForm();
    this.showForm = true;
  }

  // OPEN EDIT
  openEdit(category: Category): void {
    this.editingCategory = category;

    this.formNom = category.nom;
    this.formDescription = category.description ?? '';
    this.formParentId = category.parentId ?? null;

    this.showForm = true;
  }

  // SUBMIT
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

    if (this.editingCategory) {

      this.categoryService.update(this.editingCategory.id, payload).subscribe({
        next: () => {
          this.resetForm();
          this.load();
        }
      });

    } else {

      this.categoryService.create(payload).subscribe({
        next: () => {
          this.resetForm();
          this.load();
        }
      });
    }
  }

  // DELETE
  delete(id: number): void {
    if (!confirm('Supprimer cette catégorie ?')) return;

    this.categoryService.delete(id).subscribe({
      next: () => this.load()
    });
  }

  // RESET FORM
  resetForm(): void {
    this.showForm = false;
    this.editingCategory = null;

    this.formNom = '';
    this.formDescription = '';
    this.formParentId = null;
    this.error = '';
  }
}