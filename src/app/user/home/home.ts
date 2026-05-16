import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductCard } from '../../shared/product-card/product-card';

/**
 * Customer landing page featuring premium categories, statistics and CTA blocks.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  featuredProducts = [
    { id: 1, name: 'Lait demi-écrémé 1L', price: 2.5, image: '/products/milk.jpg', category: 'Laitiers' },
    { id: 2, name: 'Fromage Gouda 500g', price: 8.9, image: '/products/cheese.jpg', category: 'Laitiers' },
    { id: 3, name: "Huile d'olive 1L", price: 12, image: '/products/huile d olive.jpg', category: 'Épicerie' },
    { id: 4, name: 'Pain de mie 500g', price: 3.2, image: '/products/bread.jpg', category: 'Boulangerie' },
  ];

  categories = [
    { name: 'Produits laitiers', icon: '🥛', count: '45 produits' },
    { name: 'Épicerie', icon: '🥫', count: '120 produits' },
    { name: 'Boulangerie', icon: '🥖', count: '30 produits' },
    { name: 'Boissons', icon: '🥤', count: '60 produits' },
    { name: 'Hygiène', icon: '🧼', count: '85 produits' },
  ];

  stats = [
    { number: '10K+', label: 'Clients actifs' },
    { number: '500+', label: 'Produits premium' },
    { number: '24/48h', label: 'Livraison moyenne' },
    { number: '99%', label: 'Satisfaction' },
  ];

  constructor(private router: Router) {}

  /** Navigates to product listing filtered by selected category name. */
  navigateToCategory(categoryName: string): void {
    this.router.navigate(['/user/products'], {
      queryParams: { category: categoryName },
    });
  }
}
