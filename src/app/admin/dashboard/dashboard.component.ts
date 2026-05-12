import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { OrderService } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
import { StockService } from '../../shared/services/stock.service';
import { AIRecommendationService } from '../../shared/services/ai-recommendation.service';
import { SignalRService } from '../../shared/services/signalr.service';

import { Order, OrderStatus } from '../../shared/models/order.model';

import { AdminOverviewComponent } from './sections/overview/overview.component';
import { AdminProductsComponent } from './sections/products/products.component';
import { AdminStockComponent } from './sections/stocks/stocks.component';
import { AdminOrdersComponent } from './sections/orders/orders.component';
import { AdminAIComponent } from './sections/ai/ai.component';
import { CategoryComponent } from './sections/category/category.component';
import { AdminReclamationsComponent } from './sections/reclamations/admin-reclamations.component';

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
    CategoryComponent,
    AdminReclamationsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  // ✅ ENUM ACCESSIBLE DANS TEMPLATE SI BESOIN
  OrderStatus = OrderStatus;

  private activeTabSubject = new BehaviorSubject<string>('overview');
  activeTab$ = this.activeTabSubject.asObservable();

  notifications: { message: string }[] = [];

  tabs: Tab[] = [
    { id: 'overview', label: 'Tableau de bord', icon: '📊' },
    { id: 'categories', label: 'Catégories', icon: '🗂️' },
    { id: 'products', label: 'Produits', icon: '📦' },
    { id: 'stocks', label: 'Stocks', icon: '🏭' },
    { id: 'orders', label: 'Commandes', icon: '📋' },
    { id: 'ai', label: 'Recommandations IA', icon: '🤖' },
    { id: 'reclamations', label: 'Réclamations', icon: '💬' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

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
    private aiService: AIRecommendationService,
    private signalR: SignalRService
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadDashboard();

    this.signalR.startConnection();

    this.signalR.onNotification((msg: any) => {
      this.notifications.push(msg);
    });
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

      // ✅ TOTAL ORDERS
      this.dashboardStats.totalOrders = orders.length;

      // ✅ TOTAL REVENUE (SAFE FIX)
      this.dashboardStats.totalRevenue = orders.reduce((sum, order) => {

        const orderTotal = order.orderDetails?.reduce(
          (s, d) => s + (d.prixUnitaire || 0) * (d.quantite || 0),
          0
        ) || 0;

        return sum + orderTotal + (order.fraisLivraison || 0);

      }, 0);

      // ✅ FIX ENUM (IMPORTANT)
      this.dashboardStats.pendingOrders =
        orders.filter(o => o.statut === OrderStatus.EnAttente).length;

      this.dashboardStats.confirmedOrders =
        orders.filter(o => o.statut === OrderStatus.Confirmee).length;
    });

    this.productService.getAllProducts().subscribe((products: any[]) => {
      this.products = products;
      this.dashboardStats.totalProducts = products.length;
    });

    this.stockService.getStock().subscribe((stocks: any[]) => {
      this.stocks = stocks;

      this.dashboardStats.totalStock =
        stocks.reduce((sum: number, s: any) =>
          sum + (s.quantiteTotalRestante || 0), 0
        );

      this.dashboardStats.lowStockProducts =
        stocks.filter((s: any) =>
          (s.quantiteTotalRestante || 0) <= 5
        ).length;
    });

    this.loading = false;
  }

  // ✅ SWITCH TAB SAFE
  switchTab(tabId: string) {
    if (this.activeTabSubject.value === tabId) return;
    this.activeTabSubject.next(tabId);
  }

  trackByTab(index: number, tab: Tab) {
    return tab.id;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/admin/login']);
  }
}