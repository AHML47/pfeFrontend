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
  loading = true;

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

    const token = this.authService.getAccessToken();
    const payload = this.authService.decodeToken(token!);

    const userId = Number(
      payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    );

    if (isNaN(userId)) {
      console.error('userId invalide');
      this.loading = false;
      return;
    }

    // 👈 récupérer toutes les commandes et filtrer par userId
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data.filter(o => o.userId === userId);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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
      default: return '❓';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'EnAttente': return 'En attente';
      case 'Confirmee': return 'Confirmée';
      case 'Livree': return 'Livrée';
      case 'Annulee': return 'Annulée';
      default: return 'Inconnue';
    }
  }
}