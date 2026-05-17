import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly http = inject(HttpClient);

  getDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>('/api/delivery');
  }

  createDelivery(
    orderId: number,
    adresseLivraison: string,
    dateLivraisonPrevue: string
  ): Observable<Delivery> {
    return this.http.post<Delivery>('/api/delivery', {
      orderId,
      adresseLivraison,
      dateLivraisonPrevue
    });
  }

  updateStatus(
    id: number,
    statut: string,
    dateLivraisonReelle?: string
  ): Observable<void> {
    return this.http.put<void>(`/api/delivery/${id}/status`, { statut, dateLivraisonReelle });
  }

  updateDate(id: number, newDate: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`/api/delivery/${id}/date`, newDate);
  }

  getTodayProducts(): Observable<unknown[]> {
    return this.http.get<unknown[]>('/api/delivery/today/products');
  }

  getTodayClients(): Observable<unknown[]> {
    return this.http.get<unknown[]>('/api/delivery/today/clients');
  }
}
