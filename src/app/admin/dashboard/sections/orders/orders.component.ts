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

  OrderStatus = OrderStatus;

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

  // ================= LOAD ORDERS (FIX IMPORTANT STATUS)
  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => {

      this.orders = (data ?? []).map(o => ({
        ...o,
        // 🔥 FIX IMPORTANT: force enum compatibility
        statut: o.statut as OrderStatus
      }));

      this.applyFilters();
    });
  }

  // ================= FILTERS SAFE
  applyFilters() {
    let result = [...this.orders];

    if (this.filterStatus !== '') {
      result = result.filter(o =>
        String(o.statut) === String(this.filterStatus)
      );
    }

    if (this.searchQuery.trim()) {
      result = result.filter(o =>
        o.id.toString().includes(this.searchQuery)
      );
    }

    this.filteredOrders = [...result];
  }

  // ================= UPDATE STATUS
 updateStatus(order: Order) {
  console.log("STATUS SENT:", order.statut);

  this.orderService.updateOrderStatus(order.id, order.statut)
    .subscribe({
      next: () => {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], statut: order.statut };
        }
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error("UPDATE ERROR:", err)
    });
}
  // ================= VIEW DETAILS
  viewDetails(order: Order) {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  // ================= LABEL STATUS
  getStatusLabel(status: OrderStatus) {
    switch (status) {
      case OrderStatus.EnAttente: return '⏳ En attente';
      case OrderStatus.Confirmee: return '✅ Confirmée';
      case OrderStatus.Livree: return '📦 Livrée';
      case OrderStatus.Annulee: return '❌ Annulée';
      default: return '';
    }
  }
}