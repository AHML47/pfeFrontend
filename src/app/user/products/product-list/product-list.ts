import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { BehaviorSubject } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  categories: { [id: number]: string } = {};

  searchQuery: string = '';
  selectedCategory: string = '';

  // ✅ async like Orders
  products$ = new BehaviorSubject<Product[]>([]);

  // ✅ anti double click
  isLoadingAction = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {

    this.categoryService.getAll().subscribe({
      next: (cats) => {
        cats.forEach(c => this.categories[c.id] = c.nom);

        this.productService.getAllProducts().subscribe({
          next: (data: any[]) => {
            const mapped = data.map(p => this.mapProduct(p));
            this.products = mapped;
            this.products$.next(mapped);
          }
        });
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
    });
  }

  mapProduct(p: any): Product {
    return {
      id: p.id,
      name: p.nom,
      price: p.prixVente,
      description: p.description,
      stock: p.stockDisponible ?? 0,
      category: this.categories[p.categorieId] ?? 'Sans catégorie',
      image: p.image ?? '/assets/default.png'
    };
  }

  get uniqueCategories(): string[] {
    const categories = [...new Set(this.products.map(p => p.category))];
    return ['', ...categories];
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
  }

  // ✅ FIX addToCart
  addToCart(product: Product) {
    if (this.isLoadingAction) return;
    this.isLoadingAction = true;

    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter');
      this.router.navigate(['/user/login']);
      this.isLoadingAction = false;
      return;
    }

    this.cartService.addToCart(product);
    alert(`${product.name} ajouté au panier`);

    setTimeout(() => {
      this.isLoadingAction = false;
    }, 300);
  }

  // ✅ FIX navigation
  goToDetails(id: number) {
    if (this.isLoadingAction) return;
    this.isLoadingAction = true;

    this.router.navigate(['/user/products/details', id]);

    setTimeout(() => {
      this.isLoadingAction = false;
    }, 300);
  }
}