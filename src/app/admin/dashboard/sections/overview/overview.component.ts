import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardStats } from '../../dashboard.component';
import { OrderService } from '../../../../shared/services/order.service';
import { Order } from '../../../../shared/models/order.model';          // ← import depuis le modèle
import { StockService } from '../../../../shared/services/stock.service';
import { AIRecommendationService } from '../../../../shared/services/ai-recommendation.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class AdminOverviewComponent implements OnInit {

  @Input() stats: DashboardStats = {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    urgentRecommendations: 0
  };

  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private stockService: StockService,
    private aiService: AIRecommendationService
  ) {}

  ngOnInit(): void {}

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      EnAttente:  '⏳ En attente',
      Confirmee:  '✅ Confirmée',
      Livree:     '📦 Livrée',
      Annulee:    '❌ Annulée'
    };
    return labels[status] || status;
  }

  getSeverityLabel(severity: string): string {
    return severity === 'critical' ? '🔴 CRITIQUE' : '🟡 ALERTE';
  }
}