import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { OrderService } from '../../shared/services/order.service';
import { Order } from '../../shared/models/order.model';
import { ProductService } from '../../shared/services/product.service';
import { StockService } from '../../shared/services/stock.service';
import { AIRecommendationService } from '../../shared/services/ai-recommendation.service';

import { AdminOverviewComponent } from './sections/overview/overview.component';
import { AdminProductsComponent } from './sections/products/products.component';
import { AdminStockComponent } from './sections/stocks/stocks.component';
import { AdminOrdersComponent } from './sections/orders/orders.component';
import { AdminAIComponent } from './sections/ai/ai.component';
import { CategoryComponent } from './sections/category/category.component'; // ← ajouté

interface Tab {
  id: string;
  label: string;
  icon: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  urgentRecommendations: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminOverviewComponent,
    AdminProductsComponent,
    AdminStockComponent,
    AdminOrdersComponent,
    AdminAIComponent,
    CategoryComponent  // ← ajouté
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  tabs: Tab[] = [
    { id: 'overview',    label: 'Tableau de bord',     icon: '📊' },
    { id: 'categories',  label: 'Catégories',           icon: '🗂️' }, // ← ajouté
    { id: 'products',    label: 'Produits',             icon: '📦' },
    { id: 'stocks',      label: 'Stocks',               icon: '🏭' },
    { id: 'orders',      label: 'Commandes',            icon: '📋' },
    { id: 'ai',          label: 'Recommandations IA',   icon: '🤖' }
  ];

  activeTab: string = 'overview';

  orders: Order[] = [];
  products: any[] = [];
  stocks: any[] = [];

  loading: boolean = true;

  dashboardStats: DashboardStats = {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    urgentRecommendations: 0
  };

  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private stockService: StockService,
    private aiService: AIRecommendationService
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadDashboard();
  }

  checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/admin/login']);
    }
  }

  loadDashboard() {

    this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      this.orders = orders;

      this.dashboardStats.totalOrders = orders.length;

      this.dashboardStats.totalRevenue =
        orders.reduce((sum: number, order: Order) => {
          const orderTotal = order.orderDetails.reduce(
            (s, d) => s + d.prixUnitaire * d.quantite, 0
          );
          return sum + orderTotal + (order.fraisLivraison ?? 0);
        }, 0);

      this.dashboardStats.pendingOrders =
        orders.filter(o => o.statut === 'EnAttente').length;

      this.dashboardStats.confirmedOrders =
        orders.filter(o => o.statut === 'Confirmee').length;
    });

    this.productService.getAllProducts().subscribe((products: any[]) => {
      this.products = products;
      this.dashboardStats.totalProducts = products.length;
    });

    this.stockService.getAllStocks().subscribe((stocks: any[]) => {
      this.stocks = stocks;

      this.dashboardStats.totalStock = stocks.reduce(
        (sum: number, s: any) => sum + (s.quantity || 0),
        0
      );

      this.dashboardStats.lowStockProducts =
        stocks.filter((s: any) => (s.quantity || 0) <= 5).length;
    });

    const data = this.aiService.getUrgentRecommendations();
    this.dashboardStats.urgentRecommendations = data.length;

    this.loading = false;
  }

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/admin/login']);
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      EnAttente: 'En attente',
      Confirmee: 'Confirmée',
      Livree:    'Livrée',
      Annulee:   'Annulée'
    };
    return labels[status] || status;
  }

  getOrderCountByStatus(status: string): number {
    return this.orders.filter(order => order.statut === status).length;
  }
}