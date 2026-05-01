import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/user/login']);
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      this.orders = orders.filter(o => o.userId === Number(currentUser?.id)); // ← string → number
      this.loading = false;
    });
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'EnAttente': return '⏳';
      case 'Confirmee': return '✅';
      case 'Livree': return '📦';
      case 'Annulee': return '❌';
      default: return '❓';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'EnAttente': return 'En attente de confirmation';
      case 'Confirmee': return 'Confirmée';
      case 'Livree': return 'Livrée';
      case 'Annulee': return 'Annulée';
      default: return 'Inconnue';
    }
  }

  continueShopping() {
    this.router.navigate(['/user/products']);
  }
}