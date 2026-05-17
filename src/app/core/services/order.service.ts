import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiOrder, BackendProduct, Order, OrderItemPayload } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http.get<ApiOrder[]>('/api/order').pipe(
      map((orders) => orders.map((order) => this.mapOrder(order)))
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http
      .get<ApiOrder>(`/api/order/${id}`)
      .pipe(map((order) => this.mapOrder(order)));
  }

  createOrder(items: OrderItemPayload[]): Observable<{ message: string; orderId: number }> {
    return this.http
      .post<{ Message?: string; message?: string; OrderId?: number; orderId?: number }>(
        '/api/order',
        {
          Items: items.map((item) => ({
            ProduitId: item.produitId,
            Quantite: item.quantite
          }))
        }
      )
      .pipe(
        map((res) => ({
          message: res.Message ?? res.message ?? '',
          orderId: res.OrderId ?? res.orderId ?? 0
        }))
      );
  }

  updateOrderStatus(id: number, statut: string): Observable<{ message: string }> {
    return this.http
      .put<{ message?: string; Message?: string }>(`/api/order/${id}/status`, { Statut: statut })
      .pipe(map((res) => ({ message: res.message ?? res.Message ?? '' })));
  }

  deleteOrder(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message?: string; Message?: string }>(`/api/order/${id}`)
      .pipe(map((res) => ({ message: res.message ?? res.Message ?? '' })));
  }

  private mapOrder(order: ApiOrder): Order {
    const id = order.id ?? order.Id ?? 0;
    const userId = order.userId ?? order.UserId;
    const totalFinal = order.totalFinal ?? order.TotalFinal;
    const totalProduits = order.totalProduits ?? order.TotalProduits;
    const statut = order.statut ?? order.Statut ?? '';
    const details = order.orderDetails ?? order.OrderDetails ?? [];

    return {
      id,
      statut,
      userId,
      totalFinal,
      totalProduits,
      dateCommande: order.dateCommande ?? order.DateCommande,
      total: totalFinal ?? totalProduits,
      clientNom: userId !== undefined ? `User #${userId}` : undefined,
      items: details.map((detail) => ({
        produit: detail.produit ?? (detail as { Produit?: BackendProduct }).Produit,
        quantite: detail.quantite ?? (detail as { Quantite?: number }).Quantite ?? 0
      }))
    };
  }
}
