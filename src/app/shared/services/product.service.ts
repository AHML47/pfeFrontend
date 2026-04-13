import { Injectable, Inject, signal, computed } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product, ProductFormData } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // 🔹 Signal principal pour stocker les produits
  private products = signal<Product[]>([]);

  // 🔹 Computed signals pour filtrer automatiquement
  public activeProducts = computed(() =>
    this.products().filter(p => p.active)
  );

  public inactiveProducts = computed(() =>
    this.products().filter(p => !p.active)
  );

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadProducts();
  }

  // ==============================
  // 🔹 INITIALISATION DES PRODUITS
  // ==============================
  private loadProducts() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('products');

    if (saved) {
      this.products.set(JSON.parse(saved));
    } else {
      const initialProducts: Product[] = [
        {
          id: 'PROD-001',
          name: 'Huile d\'olive premium',
          description: 'Huile d\'olive vierge extra de Tunisie',
          sku: 'HUILE-001',
          price: 45,
          category: 'Huiles',
          image: '/assets/products/huile.jpg',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          minimumStock: 20
        },
        {
          id: 'PROD-002',
          name: 'Miel naturel',
          description: 'Miel pur produit localement',
          sku: 'MIEL-001',
          price: 35,
          category: 'Condiments',
          image: '/assets/products/miel.jpg',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          minimumStock: 15
        }
      ];

      this.products.set(initialProducts);
      this.saveProducts();
    }
  }

  // ==============================
  // 🔹 ENREGISTRER LES PRODUITS DANS LOCALSTORAGE
  // ==============================
  private saveProducts() {
    if (this.isBrowser) {
      localStorage.setItem('products', JSON.stringify(this.products()));
    }
  }

  // ==============================
  // 🔹 GETTERS
  // ==============================
  getAllProducts(): Product[] {
    return this.products();
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  // ==============================
  // 🔹 CRUD
  // ==============================
  addProduct(data: ProductFormData): Product {
    const newProduct: Product = {
      id: 'PROD-' + (this.products().length + 1).toString().padStart(3, '0'),
      ...data,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.products.set([...this.products(), newProduct]);
    this.saveProducts();

    return newProduct;
  }

  updateProduct(id: string, data: Partial<Product>): Product | undefined {
    const updated = this.products().map(p =>
      p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
    );

    this.products.set(updated);
    this.saveProducts();

    return updated.find(p => p.id === id);
  }

  deleteProduct(id: string): boolean {
    const filtered = this.products().filter(p => p.id !== id);

    if (filtered.length !== this.products().length) {
      this.products.set(filtered);
      this.saveProducts();
      return true;
    }

    return false;
  }

  toggleProductStatus(id: string, active: boolean): Product | undefined {
    return this.updateProduct(id, { active });
  }

  // ==============================
  // 🔹 RECHERCHE
  // ==============================
  searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }
}