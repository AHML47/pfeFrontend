import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product.service';
import { Product, ProductFormData } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchQuery: string = '';

  // ❌ IMPORTANT : DOIT ÊTRE FALSE AU DÉPART
  showDetailModal = false;
  showFormModal = false;

  modalMode: 'add' | 'edit' = 'add';

  selectedProduct: Product | null = null;

  form: ProductFormData = this.resetForm();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // 🔹 LOAD
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res || [];
        this.filterProducts();
      },
      error: (err) => console.error(err)
    });
  }

  // 🔹 FILTER
  filterProducts() {
    this.filteredProducts = this.products.filter(p =>
      p.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearch() {
    this.filterProducts();
  }

  // 🔹 VIEW MODAL
  openViewModal(product: Product) {
    this.selectedProduct = product;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.selectedProduct = null;
    this.showDetailModal = false;
  }

  // 🔹 ADD MODAL
  openAddModal() {
    this.modalMode = 'add';
    this.form = this.resetForm();
    this.selectedProduct = null;
    this.showFormModal = true;
  }

  // 🔹 EDIT MODAL
  openEditModal(product: Product) {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.form = { ...product };
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.form = this.resetForm();
    this.selectedProduct = null;
  }

  // 🔹 SAVE
  saveProduct() {

    if (!this.form.nom || this.form.prixVente <= 0) {
      alert('Champs obligatoires manquants');
      return;
    }

    if (this.modalMode === 'add') {
      this.productService.addProduct(this.form).subscribe({
        next: () => {
          this.loadProducts();
          this.closeFormModal();
        },
        error: (err) => console.error(err)
      });

    } else if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, this.form)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeFormModal();
          },
          error: (err) => console.error(err)
        });
    }
  }

  // 🔹 DELETE
  deleteProduct(id: number) {
    if (confirm('Supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error(err)
      });
    }
  }

  // 🔹 RESET FORM
  resetForm(): ProductFormData {
    return {
      nom: '',
      description: '',
      prixVente: 0,
      prixAchat: 0,
      categorieId: 0,
      isActive: true,
      stockActuel: 0,
      minimumStock: 0,
      type: 'fixe',
      pourcentage: 0
    };
  }

  // ✅ Calculer le prix basé sur le type
  calculatePrice(product: Product): number {
    if (product.type === 'fixe') {
      return product.prixVente;
    } else if (product.type === 'libre' && product.pourcentage) {
      return product.prixVente * (1 + product.pourcentage / 100);
    }
    return product.prixVente;
  }
}