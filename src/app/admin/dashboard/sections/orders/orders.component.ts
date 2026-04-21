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

  selectedOrder: Order | null = null;
  showDetailModal = false;

  filterStatus: OrderStatus | '' = '';
  searchQuery = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // ================= LOAD =================
  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
      this.applyFilters();
    });
  }

  // ================= FILTER =================
  applyFilters() {
    let filtered = this.orders;

    // filter status
    if (this.filterStatus) {
      filtered = filtered.filter(o => o.statut === this.filterStatus);
    }

    // search by id
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toString().includes(q)
      );
    }

    this.filteredOrders = filtered;
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  // ================= VIEW =================
  viewDetails(order: Order) {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeModal() {
    this.selectedOrder = null;
    this.showDetailModal = false;
  }

  // ================= CANCEL =================
  cancelOrder(order: Order) {
    if (confirm('Annuler cette commande ?')) {
      this.orderService.cancelOrder(order.id).subscribe(success => {
        if (success) {
          this.loadOrders();
          this.closeModal();
        }
      });
    }
  }

  // ================= STATUS LABEL =================
  getStatusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      EnAttente: '⏳ En attente',
      Validee: '✅ Validée',
      Livree: '🚚 Livrée',
      Annulee: '❌ Annulée'
    };

    return map[status];
  }

  // ================= STATUS COLOR =================
  getStatusColor(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      EnAttente: 'status-pending',
      Validee: 'status-confirmed',
      Livree: 'status-delivered',
      Annulee: 'status-cancelled'
    };

    return map[status];
  }
}