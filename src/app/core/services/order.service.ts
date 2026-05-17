import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItemPayload } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/order');
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`/api/order/${id}`);
  }

  createOrder(items: OrderItemPayload[]): Observable<{ message: string; orderId: number }> {
    return this.http.post<{ message: string; orderId: number }>('/api/order', { items });
  }

  updateOrderStatus(id: number, statut: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`/api/order/${id}/status`, { statut });
  }

  deleteOrder(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/order/${id}`);
  }
}
