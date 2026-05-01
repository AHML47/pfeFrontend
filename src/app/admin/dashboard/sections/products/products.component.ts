import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../../shared/services/product.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { Product, ProductFormData } from '../../../../shared/models/product.model';
import { Category } from '../../../../shared/models/category.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  searchQuery = '';
  loading = false;
  error = '';

  // FORM SIMPLE (SANS MODAL)
  showForm = false;
  editMode = false;
  selectedId: number | null = null;

  form: ProductFormData = {
    nom: '',
    description: '',
    prix: 0,
    categorieId: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  // ================= LOAD =================
  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement produits';
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data
    });
  }

  // ================= SEARCH =================
  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.nom.toLowerCase().includes(q)
    );
  }

  // ================= FORM OPEN =================
  openAddForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.selectedId = null;

    this.form = {
      nom: '',
      description: '',
      prix: 0,
      categorieId: 0
    };
  }

  openEditForm(p: Product): void {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = p.id;

    this.form = {
      nom: p.nom,
      description: p.description,
      prix: p.prixAchat,
      categorieId: p.categorieId
    };
  }

  closeForm(): void {
    this.showForm = false;
    this.error = '';
  }

  // ================= SAVE =================
  save(): void {

    if (!this.form.nom.trim()) {
      this.error = 'Nom obligatoire';
      return;
    }

    if (this.form.categorieId === 0) {
      this.error = 'Choisir catégorie';
      return;
    }

    if (this.form.prix <= 0) {
      this.error = 'Prix invalide';
      return;
    }

    this.error = '';

    if (this.editMode && this.selectedId) {

      this.productService.updateProduct(this.selectedId, this.form).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
        }
      });

    } else {

      this.productService.addProduct(this.form).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
        }
      });
    }
  }

  // ================= DELETE =================
  delete(id: number): void {
    if (!confirm('Supprimer ce produit ?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts()
    });
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id === id)?.nom || 'N/A';
  }
}