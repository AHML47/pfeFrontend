import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Observable, map } from 'rxjs';
import { Order, OrderStatus } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderListComponent {

  orders$!: Observable<Order[]>;

  // 🔥 important pour HTML si besoin
  OrderStatus = OrderStatus;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadOrders();
  }

  loadOrders() {
    const token = this.authService.getAccessToken();
    const payload = this.authService.decodeToken(token!);

    const userId = Number(
      payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    );

    this.orders$ = this.orderService.getAllOrders().pipe(
      map(orders => orders.filter(o => o.userId === userId))
    );
  }

  continueShopping() {
    this.router.navigate(['/user/products']);
  }

  // ✅ FIX IMPORTANT : plus de number → OrderStatus
  getStatusIcon(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.EnAttente: return '⏳';
      case OrderStatus.Confirmee: return '✅';
      case OrderStatus.Livree: return '📦';
      case OrderStatus.Annulee: return '❌';
      default: return '';
    }
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.EnAttente: return 'En attente';
      case OrderStatus.Confirmee: return 'Confirmée';
      case OrderStatus.Livree: return 'Livrée';
      case OrderStatus.Annulee: return 'Annulée';
      default: return '';
    }
  }
}