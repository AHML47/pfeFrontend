import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Delivery, DeliveryTodayClient, DeliveryTodayProduct } from '../../user.products';

type ApiDelivery = Delivery & {
  Id?: number;
  OrderId?: number;
  AdresseLivraison?: string;
  DateLivraisonPrevue?: string;
  DateLivraisonReelle?: string;
  Statut?: string;
};

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly http = inject(HttpClient);

  getDeliveries(): Observable<Delivery[]> {
    return this.http.get<ApiDelivery[]>('/api/delivery').pipe(
      map((items) => items.map((item) => this.mapDelivery(item)))
    );
  }

  createDelivery(
    orderId: number,
    adresseLivraison: string,
    dateLivraisonPrevue: string
  ): Observable<Delivery> {
    return this.http
      .post<ApiDelivery>(
        '/api/delivery',
        {
          OrderId: orderId,
          AdresseLivraison: adresseLivraison,
          DateLivraisonPrevue: dateLivraisonPrevue
        }
      )
      .pipe(map((item) => this.mapDelivery(item)));
  }

  updateStatus(
    id: number,
    statut: string,
    dateLivraisonReelle?: string
  ): Observable<string> {
    return this.http.put<string>(`/api/delivery/${id}/status`, {
      Statut: statut,
      DateLivraisonReelle: dateLivraisonReelle
    });
  }

  updateDate(id: number, newDate: string): Observable<string> {
    return this.http.put<string>(`/api/delivery/${id}/date`, newDate);
  }

  getTodayProducts(): Observable<DeliveryTodayProduct[]> {
    return this.http.get<DeliveryTodayProduct[]>('/api/delivery/today/products');
  }

  getTodayClients(): Observable<DeliveryTodayClient[]> {
    return this.http.get<DeliveryTodayClient[]>('/api/delivery/today/clients');
  }

  private mapDelivery(item: ApiDelivery): Delivery {
    return {
      id: item.id ?? item.Id ?? 0,
      orderId: item.orderId ?? item.OrderId ?? 0,
      adresseLivraison: item.adresseLivraison ?? item.AdresseLivraison ?? '',
      dateLivraisonPrevue: item.dateLivraisonPrevue ?? item.DateLivraisonPrevue ?? '',
      dateLivraisonReelle: item.dateLivraisonReelle ?? item.DateLivraisonReelle,
      statut: item.statut ?? item.Statut
    };
  }
}
