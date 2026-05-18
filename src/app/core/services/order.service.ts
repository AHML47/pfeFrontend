import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  ApiOrder,
  BackendProduct,
  CreateOrderDto,
  Delivery,
  Order,
  OrderStatus
} from '../../user.products';

interface OrderApiResponse {
  message?: string;
  Message?: string;
  orderId?: number;
  OrderId?: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly userEndpoint = '/api/order';
  private readonly adminEndpoint = '/api/order';

  getUserOrders(): Observable<Order[]> {
    return this.http.get<ApiOrder[]>(this.userEndpoint).pipe(
      map((orders) => orders.map((order) => this.mapOrder(order)))
    );
  }

  getAdminOrders(): Observable<Order[]> {
    return this.http.get<ApiOrder[]>(this.adminEndpoint).pipe(
      map((orders) => orders.map((order) => this.mapOrder(order)))
    );
  }

  getUserOrder(id: number): Observable<Order> {
    return this.http
      .get<ApiOrder>(`${this.userEndpoint}/${id}`)
      .pipe(map((order) => this.mapOrder(order)));
  }

  getAdminOrder(id: number): Observable<Order> {
    return this.http
      .get<ApiOrder>(`${this.adminEndpoint}/${id}`)
      .pipe(map((order) => this.mapOrder(order)));
  }

  createOrder(order: CreateOrderDto): Observable<{ message: string; orderId: number }> {
    return this.http
      .post<OrderApiResponse>(this.userEndpoint, {
        articles: order.articles.map((article) => ({
          produitId: article.produitId,
          quantite: article.quantite,
          prixUnitaire: article.prixUnitaire
        })),
        adresseLivraison: order.adresseLivraison,
        fraisLivraison: order.fraisLivraison
      })
      .pipe(
        map((res) => ({
          message: res.Message ?? res.message ?? '',
          orderId: res.OrderId ?? res.orderId ?? 0
        }))
      );
  }

  updateOrderStatus(id: number, statut: OrderStatus): Observable<{ message: string }> {
    return this.http
      .put<{ message?: string; Message?: string }>(`${this.adminEndpoint}/${id}/status`, {
        statut,
        Statut: statut
      })
      .pipe(map((res) => ({ message: res.message ?? res.Message ?? '' })));
  }

  deleteOrder(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message?: string; Message?: string }>(`${this.userEndpoint}/${id}`)
      .pipe(map((res) => ({ message: res.message ?? res.Message ?? '' })));
  }

  private mapOrder(order: ApiOrder): Order {
    const id = order.id ?? order.Id ?? 0;
    const userId = order.userId ?? order.UserId;
    const totalFinal = order.totalFinal ?? order.TotalFinal;
    const totalProduits = order.totalProduits ?? order.TotalProduits;
    const fraisLivraison = order.fraisLivraison ?? order.FraisLivraison;
    const statut = order.statut ?? order.Statut ?? '';
    const details = order.orderDetails ?? order.OrderDetails ?? [];
    const delivery = this.mapDelivery(order.delivery ?? order.Delivery, id);

    return {
      id,
      statut,
      userId,
      totalFinal,
      totalProduits,
      fraisLivraison,
      dateCommande: order.dateCommande ?? order.DateCommande,
      delivery,
      orderDetails: details,
      total: totalFinal ?? (totalProduits ?? 0) + (fraisLivraison ?? 0),
      clientNom: userId !== undefined ? `User #${userId}` : undefined,
      items: details.map((detail) => ({
        produit: detail.produit ?? (detail as { Produit?: BackendProduct }).Produit,
        quantite: detail.quantite ?? (detail as { Quantite?: number }).Quantite ?? 0
      }))
    };
  }

  private mapDelivery(raw: Delivery | undefined, orderId: number): Delivery | undefined {
    if (!raw) {
      return undefined;
    }

    return {
      id: raw.id,
      orderId: raw.orderId ?? orderId,
      adresse: raw.adresse ?? raw.adresseLivraison,
      adresseLivraison: raw.adresseLivraison ?? raw.adresse ?? '',
      dateCreation: raw.dateCreation,
      dateLivraisonPrevue: raw.dateLivraisonPrevue ?? raw.dateCreation ?? '',
      statut: raw.statut,
      dateLivraisonReelle: raw.dateLivraisonReelle
    };
  }
}
