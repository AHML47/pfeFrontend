import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from '../../dashboard.component';
import { OrderService, Order } from '../../../../shared/services/order.service';
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
  @Input() stats!: DashboardStats;
  
  orders: Order[] = [];
  activeAlerts: any[] = [];
  urgentRecommendations: any[] = [];

  constructor(
    private orderService: OrderService,
    private stockService: StockService,
    private aiService: AIRecommendationService
  ) {}

  ngOnInit() {
    this.orders = this.orderService.getAllOrders();
    this.activeAlerts = this.stockService.getActiveAlerts();
    this.urgentRecommendations = this.aiService.getUrgentRecommendations();
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': '⏳ En attente',
      'confirmed': '✅ Confirmée',
      'preparation': '🔄 Préparation',
      'shipped': '📦 Expédiée',
      'delivered': '✓ Livrée',
      'cancelled': '❌ Annulée'
    };
    return labels[status] || status;
  }

  getSeverityLabel(severity: string): string {
    return severity === 'critical' ? '🔴 CRITIQUE' : '🟡 ALERTE';
  }
}
