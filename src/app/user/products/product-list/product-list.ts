import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';

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
  categories: { [id: number]: string } = {}; // 👈 map id → nom

  searchQuery: string = '';
  selectedCategory: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private categoryService: CategoryService // 👈 injecter
  ) {}

  ngOnInit() {
    // 1️⃣ Charger les catégories d'abord
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        // Construire le map id → nom
        cats.forEach(c => this.categories[c.id] = c.nom);

        // 2️⃣ Ensuite charger les produits
        this.productService.getAllProducts().subscribe({
          next: (data: any[]) => {
            this.products = data.map(p => this.mapProduct(p));
          },
          error: (err) => console.log(err)
        });
      },
      error: (err) => console.log(err)
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
      price: p.prixAchat,
      description: p.description,
      stock: p.stockDisponible ?? 0,
      category: this.categories[p.categorieId] ?? 'Sans catégorie', // 👈 utiliser le map
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

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter');
      this.router.navigate(['/user/login']);
      return;
    }

    this.cartService.addToCart(product);
    alert(`${product.name} ajouté au panier`);
  }

  goToDetails(id: number) {
    this.router.navigate(['/user/products/details', id]);
  }
}