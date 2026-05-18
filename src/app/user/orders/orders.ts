import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../user.products';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  orders: Order[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos commandes.';
        this.loading = false;
      }
    });
  }

  trackOrderItem(index: number): number {
    return index;
  }

  getDeliveryAddress(order: Order): string {
    return order.delivery?.adresseLivraison ?? order.delivery?.adresse ?? '—';
  }

  getItemLabel(item: { produit?: { libelle?: string; description?: string } }): string {
    return item.produit?.libelle ?? item.produit?.description ?? '—';
  }
}