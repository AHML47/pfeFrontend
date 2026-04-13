import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product.service';
import { StockService } from '../../../../shared/services/stock.service';
import { Product } from '../../../../shared/models/product.model';

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
  showModal: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedProduct: Product | null = null;
  searchQuery: string = '';
  filterActive: boolean = true;

  // Formulaire
  form = {
    name: '',
    description: '',
    sku: '',
    price: 0,
    category: '',
    image: '',
    minimumStock: 10
  };

  constructor(
    private productService: ProductService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productService.getAllProducts();
    this.filterProducts();
  }

  filterProducts() {
    let filtered = this.products;

    // Filtre statut
    if (this.filterActive) {
      filtered = filtered.filter(p => p.active);
    }

    // Recherche
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = filtered;
  }

  onSearch() {
    this.filterProducts();
  }

  toggleFilterActive() {
    this.filterActive = !this.filterActive;
    this.filterProducts();
  }

  // Modal
  openAddModal() {
    this.resetFormData();
    this.modalMode = 'add';
    this.selectedProduct = null;
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.form = { ...product };
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetFormData();
  }

  resetFormData() {
    this.form = {
      name: '',
      description: '',
      sku: '',
      price: 0,
      category: '',
      image: '',
      minimumStock: 10
    };
  }

  saveProduct() {
    // Validation
    if (!this.form.name || !this.form.sku || this.form.price <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.modalMode === 'add') {
      this.productService.addProduct(this.form);
      alert('Produit ajouté avec succès!');
    } else if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, this.form);
      alert('Produit modifié avec succès!');
    }

    this.closeModal();
    this.loadProducts();
  }

  deleteProduct(productId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      this.productService.deleteProduct(productId);
      alert('Produit supprimé avec succès!');
      this.loadProducts();
    }
  }

  toggleStatus(product: Product) {
    this.productService.toggleProductStatus(product.id, !product.active);
    this.loadProducts();
  }

  getStockQuantity(productId: string): number {
    const stock = this.stockService.getProductStock(productId);
    return stock?.quantity ?? 0;
  }
}
