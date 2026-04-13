import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product: any;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  addToCart() {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter un produit au panier');
      this.router.navigate(['/user/login']);
      return;
    }

    // Ajouter au panier
    this.cartService.addToCart(this.product);
    alert(`${this.product.name} a été ajouté au panier!`);
  }
}
