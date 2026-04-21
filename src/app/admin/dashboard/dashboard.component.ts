import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { OrderService, Order } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
import { StockService } from '../../shared/services/stock.service';
import { AIRecommendationService } from '../../shared/services/ai-recommendation.service';

import { AdminOverviewComponent } from './sections/overview/overview.component';
import { AdminProductsComponent } from './sections/products/products.component';
import { AdminStocksComponent } from './sections/stocks/stocks.component';
import { AdminOrdersComponent } from './sections/orders/orders.component';
import { AdminAIComponent } from './sections/ai/ai.component';

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
  activeAlerts: number;
  urgentRecommendations: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminOverviewComponent,
    AdminProductsComponent,
    AdminStocksComponent,
    AdminOrdersComponent,
    AdminAIComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  tabs: Tab[] = [
    { id: 'overview', label: 'Tableau de bord', icon: '📊' },
    { id: 'products', label: 'Produits', icon: '📦' },
    { id: 'stocks', label: 'Stocks', icon: '🏭' },
    { id: 'orders', label: 'Commandes', icon: '📋' },
    { id: 'ai', label: 'Recommandations IA', icon: '🤖' }
  ];

  activeTab: string = 'overview';
  orders: Order[] = [];
  loading: boolean = true;
  private isBrowser: boolean;

  dashboardStats: DashboardStats = {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    activeAlerts: 0,
    urgentRecommendations: 0
  };

  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private stockService: StockService,
    private aiService: AIRecommendationService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.checkAuth();
    this.loadDashboard();
  }

  checkAuth() {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      this.router.navigate(['/admin/login']);
    }
  }

  loadDashboard() {

    // 🔹 ORDERS
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;

      this.dashboardStats.totalOrders = orders.length;

      this.dashboardStats.totalRevenue =
        orders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);

      // ✅ FIX : Changez 'pending' → 'EnAttente'
      this.dashboardStats.pendingOrders =
        orders.filter(o => o.statut === 'EnAttente').length;

      // ✅ FIX : Changez 'confirmed' → 'Validee'
      this.dashboardStats.confirmedOrders =
        orders.filter(o => o.statut === 'Validee').length;
    });

    // 🔹 STOCK STATS
    this.stockService.getStockStats().subscribe(stocks => {
      this.dashboardStats.totalProducts = stocks.totalProducts;
      this.dashboardStats.totalStock = stocks.totalQuantity;
      this.dashboardStats.lowStockProducts = stocks.productsLowStock;
    });

    // 🔹 ALERTS
    this.stockService.getActiveAlerts().subscribe(alerts => {
      this.dashboardStats.activeAlerts = alerts.length;
    });

    // 🔹 AI
    this.dashboardStats.urgentRecommendations =
      this.aiService.getUrgentRecommendations().length;

    this.loading = false;
  }

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
    }
    this.router.navigate(['/admin/login']);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'preparation': 'Préparation',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };

    return labels[status] || status;
  }

  getOrderCountByStatus(status: string): number {
    return this.orders.filter(order => order.statut === status).length;
  }
}