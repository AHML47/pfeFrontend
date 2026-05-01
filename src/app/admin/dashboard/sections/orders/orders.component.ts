import { Component, OnInit } from '@angular/core';
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

  selectedOrder!: Order;
  showDetailModal = false;

  searchQuery = '';
  filterStatus: OrderStatus | '' = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // LOAD
  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
      this.applyFilters();
    });
  }

  // FILTER
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

  // VIEW DETAILS
  viewDetails(order: Order) {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeModal() {
    this.showDetailModal = false;
  }

  // CANCEL ORDER
  cancelOrder(order: Order) {
    if (confirm('Annuler cette commande ?')) {
      this.orderService.cancelOrder(order.id).subscribe(() => {
        this.loadOrders();
        this.closeModal();
      });
    }
  }

  // STATUS LABEL
  getStatusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      EnAttente: '⏳ En attente',
      Confirmee: '✅ Confirmée',
      Livree: '🚚 Livrée',
      Annulee: '❌ Annulée'
    };

    return map[status];
  }

  // STATUS COLOR
  getStatusColor(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      EnAttente: 'status-pending',
      Confirmee: 'status-confirmed',
      Livree: 'status-delivered',
      Annulee: 'status-cancelled'
    };

    return map[status];
  }
}