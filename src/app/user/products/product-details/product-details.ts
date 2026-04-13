import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';

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
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  quantity: number = 1;

  // Liste de tous les produits
  allProducts: Product[] = [
    // Produits laitiers
    { id: 1, name: 'Lait demi-écrémé 1L', price: 2.5, description: 'Lait frais et délicieux', stock: 150, category: 'Produits laitiers', image: '/products/milk.jpg' },
    { id: 2, name: 'Fromage Gouda 500g', price: 8.9, description: 'Fromage hollandais de qualité', stock: 60, category: 'Produits laitiers', image: '/products/cheese.jpg' },
    { id: 9, name: 'Yaourt Naturel 500g', price: 3.5, description: 'Yaourt fermier', stock: 120, category: 'Produits laitiers', image: '/products/yaourt naturel.jpg' },
    { id: 10, name: 'Beurre 250g', price: 6.2, description: 'Beurre de qualité', stock: 80, category: 'Produits laitiers', image: '/products/beurre.jpg' },
    { id: 11, name: 'Mozzarella 250g', price: 7.8, description: 'Fromage frais', stock: 45, category: 'Produits laitiers', image: '/products/mozzarella.jpg' },

    // Épicerie
    { id: 3, name: "Huile d'olive 1L", price: 12, description: 'Huile extra vierge', stock: 8, category: 'Épicerie', image: '/products/huile d olive.jpg' },
    { id: 7, name: 'Sucre blanc 1kg', price: 2.1, description: 'Sucre raffiné', stock: 200, category: 'Épicerie', image: '/products/sucre blanc.jpg' },
    { id: 12, name: 'Riz blanc 2kg', price: 5.5, description: 'Riz long grain', stock: 95, category: 'Épicerie', image: '/products/riz blanc.jpg' },
    { id: 13, name: 'Farine de blé 1kg', price: 3.2, description: 'Farine premium', stock: 110, category: 'Épicerie', image: '/products/farine de blé.jpg' },
    { id: 14, name: 'Pâtes 500g', price: 1.8, description: 'Pâtes spaghetti', stock: 160, category: 'Épicerie', image: '/products/pates.jpg' },

    // Boulangerie
    { id: 4, name: 'Pain de mie 500g', price: 3.2, description: 'Pain moelleux', stock: 45, category: 'Boulangerie', image: '/products/bread.jpg' },
    { id: 15, name: 'Croissants (6)', price: 5.5, description: 'Croissants frais', stock: 30, category: 'Boulangerie', image: '/products/croisssants.jpg' },
    { id: 16, name: 'Pain complet 500g', price: 3.8, description: 'Pain riche en fibres', stock: 55, category: 'Boulangerie', image: '/products/pain complet.jpg' },
    { id: 17, name: 'Baguette française', price: 2.5, description: 'Baguette croustillante', stock: 75, category: 'Boulangerie', image: '/products/baguette francaise.jpg' },

    // Boissons
    { id: 5, name: 'Thé vert 100g', price: 4.5, description: 'Thé vert naturel', stock: 90, category: 'Boissons', image: '/products/the vert.jpg' },
    { id: 6, name: 'Café moulu 250g', price: 7.8, description: 'Café arabica', stock: 5, category: 'Boissons', image: '/products/cafe moulu.jpg' },
    { id: 18, name: 'Jus d\'orange 1L', price: 4.2, description: 'Jus frais pressé', stock: 85, category: 'Boissons', image: '/products/jus d orange.jpg' },
    { id: 19, name: 'Lait fermenté 500ml', price: 3.0, description: 'Boisson probiotique', stock: 70, category: 'Boissons', image: '/products/lait fermenté.jpg' },
    { id: 20, name: 'Eau minérale 6x1.5L', price: 3.5, description: 'Eau pure naturelle', stock: 120, category: 'Boissons', image: '/products/eau minérale.jpg' },

    // Hygiène
    { id: 8, name: 'Savon liquide 500ml', price: 5.5, description: 'Savon doux', stock: 70, category: 'Hygiène', image: '/products/savon liquide.jpg' },
    { id: 21, name: 'Shampooing 250ml', price: 6.8, description: 'Shampooing doux', stock: 50, category: 'Hygiène', image: '/products/shampooing.jpg' },
    { id: 22, name: 'Dentifrice 75ml', price: 2.5, description: 'Dentifrice fluor', stock: 100, category: 'Hygiène', image: '/products/dentifrice.jpg' },
    { id: 23, name: 'Serviettes (20)', price: 3.2, description: 'Serviettes hygiéniques', stock: 60, category: 'Hygiène', image: '/products/serviettes.jpg' },
    { id: 24, name: 'Gel douche 400ml', price: 4.5, description: 'Gel nettoyant', stock: 80, category: 'Hygiène', image: '/products/gel douche.jpg' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.product = this.allProducts.find(p => p.id === id) || null;
    });
  }

  addToCart() {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter un produit au panier');
      this.router.navigate(['/user/login']);
      return;
    }

    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      alert(`${this.quantity} x ${this.product.name} ajouté au panier!`);
    }
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack() {
    this.router.navigate(['/user/products']);
  }
}
