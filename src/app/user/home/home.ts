import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductCard } from '../../shared/product-card/product-card';
import { HeroComponent } from '../../shared/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCard, RouterLink, HeroComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  // Featured Products
  featuredProducts = [
    { id: 1, name: 'Lait demi-écrémé 1L', price: 2.5, image: '/products/milk.jpg', category: 'Laitiers' },
    { id: 2, name: 'Fromage Gouda 500g', price: 8.9, image: '/products/cheese.jpg', category: 'Laitiers' },
    { id: 3, name: 'Huile d\'olive 1L', price: 12, image: '/products/huile d olive.jpg', category: 'Épicerie' },
    { id: 4, name: 'Pain de mie 500g', price: 3.2, image: '/products/bread.jpg', category: 'Boulangerie' }
  ];

  // Categories
  categories = [
    { name: 'Produits laitiers', icon: '🥛', count: '45 produits', color: '#3b82f6' },
    { name: 'Épicerie', icon: '🥫', count: '120 produits', color: '#f59e0b' },
    { name: 'Boulangerie', icon: '🥖', count: '30 produits', color: '#ec4899' },
    { name: 'Boissons', icon: '🥤', count: '60 produits', color: '#10b981' },
    { name: 'Hygiène', icon: '🧼', count: '85 produits', color: '#8b5cf6' }
  ];

  // Advantages
  advantages = [
    {
      icon: '🚚',
      title: 'Livraison Rapide',
      description: 'Livraison en 24-48h dans toute la région'
    },
    {
      icon: '💰',
      title: 'Prix Compétitifs',
      description: 'Les meilleurs prix wholesale du marché'
    },
    {
      icon: '✅',
      title: 'Qualité Garantie',
      description: 'Tous les produits testés et certifiés'
    },
    {
      icon: '📞',
      title: 'Support 24/7',
      description: 'Équipe support disponible 24h/24'
    }
  ];

  stats = [
    { number: '10K+', label: 'Clients Satisfaits' },
    { number: '500+', label: 'Produits' },
    { number: '48h', label: 'Livraison Rapide' },
    { number: '99%', label: 'Satisfaction' }
  ];

  constructor(private router: Router) {}

  navigateToCategory(categoryName: string) {
    this.router.navigate(['/user/products'], {
      queryParams: { category: categoryName }
    });
  }
}