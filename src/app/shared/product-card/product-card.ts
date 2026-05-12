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
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter un produit au panier');
      this.router.navigate(['/user/login']);
      return;
    }

  const productNormalized = {
    id: this.product.id,
    name: this.product.nom || this.product.name,
price: this.product.prixAchat ?? this.product.prix ?? this.product.prixVente ?? this.product.price ?? 0,    image: this.product.image || ''
  };


    this.cartService.addToCart(productNormalized);
    alert(`${productNormalized.name} a été ajouté au panier!`);
  }

  goToDetails() {
    this.router.navigate(['/user/products/details', this.product.id]);
  }
}