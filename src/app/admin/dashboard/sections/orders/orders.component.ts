import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../../../shared/services/order.service';

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

  selectedOrder: Order | null = null;
  showDetailModal: boolean = false;

  filterStatus: string = '';
  searchQuery: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orders = this.orderService.getAllOrders();
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.orders;

    if (this.filterStatus) {
      filtered = filtered.filter(o => o.status === this.filterStatus);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.userName.toLowerCase().includes(q)
      );
    }

    this.filteredOrders = filtered;
  }

  viewDetails(order: Order) {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  changeStatus(order: Order, newStatus: Order['status']) {
    if (confirm(`Changer le statut à "${this.getStatusLabel(newStatus)}" ?`)) {
      this.orderService.updateOrderStatus(order.id, newStatus);
      this.loadOrders();

      if (this.selectedOrder?.id === order.id) {
        this.selectedOrder.status = newStatus;
      }
    }
  }

  cancelOrder(order: Order) {
    if (confirm('Annuler cette commande ?')) {
      this.orderService.updateOrderStatus(order.id, 'cancelled');
      this.loadOrders();
      this.closeModal();
    }
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

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'preparation': 'status-preparation',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return colors[status] || '';
  }

  getNextStatusOptions(status: string): Order['status'][] {
    const workflows: { [key: string]: Order['status'][] } = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparation', 'cancelled'],
      'preparation': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': []
    };
    return workflows[status] || [];
  }
}