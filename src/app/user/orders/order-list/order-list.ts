import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Observable, map } from 'rxjs';
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderListComponent {

  orders$!: Observable<Order[]>;

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

    // ✅ ASYNC STYLE (comme admin)
    this.orders$ = this.orderService.getAllOrders().pipe(
      map(orders => orders.filter(o => o.userId === userId))
    );
  }

  continueShopping() {
    this.router.navigate(['/user/products']);
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'EnAttente': return '⏳';
      case 'Confirmee': return '✅';
      case 'Livree': return '📦';
      case 'Annulee': return '❌';
      default: return '';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'EnAttente': return 'En attente';
      case 'Confirmee': return 'Confirmée';
      case 'Livree': return 'Livrée';
      case 'Annulee': return 'Annulée';
      default: return '';
    }
  }
}