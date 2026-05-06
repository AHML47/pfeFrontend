import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../shared/services/order.service';
import { Order, OrderStatus } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  searchQuery = '';
  filterStatus: OrderStatus | '' = '';

  selectedOrder: Order | null = null;
  showDetailModal = false;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    let result = this.orders;

    if (this.filterStatus) {
      result = result.filter(o => o.statut === this.filterStatus);
    }

    if (this.searchQuery.trim()) {
      result = result.filter(o =>
        o.id.toString().includes(this.searchQuery)
      );
    }

    this.filteredOrders = result;
  }

  // ✅ MODAL FIX
  viewDetails(order: Order) {
    this.selectedOrder = order;
    this.showDetailModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  updateStatus(order: Order) {
    this.orderService.updateOrderStatus(order.id, order.statut)
      .subscribe({
        next: () => this.loadOrders(),
        error: () => alert('Erreur mise à jour statut')
      });
  }

  cancelOrder(order: Order) {
    if (confirm('Annuler cette commande ?')) {
      this.orderService.cancelOrder(order.id).subscribe(() => {
        this.loadOrders();
        this.closeModal();
      });
    }
  }

  getStatusLabel(status: OrderStatus) {
    return {
      EnAttente: '⏳ En attente',
      Confirmee: '✅ Confirmée',
      Livree: '🚚 Livrée',
      Annulee: '❌ Annulée'
    }[status];
  }

  getStatusColor(status: OrderStatus) {
    return {
      EnAttente: 'status-pending',
      Confirmee: 'status-confirmed',
      Livree: 'status-delivered',
      Annulee: 'status-cancelled'
    }[status];
  }
}