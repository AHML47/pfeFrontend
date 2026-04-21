import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Order } from '../models/order.model';
export type { Order };
export interface OrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private API_URL = `${environment.apiEndpoint}/orders`;

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ================= GET USER ORDERS =================
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL).pipe(
      tap(data => this.ordersSubject.next(data)),
      catchError(() => of([]))
    );
  }

  // ================= GET ALL (ADMIN) =================
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/all`).pipe(
      tap(data => this.ordersSubject.next(data)),
      catchError(() => of([]))
    );
  }

  // ================= GET BY ID =================
  getOrderById(id: number): Observable<Order | null> {
    return this.http.get<Order>(`${this.API_URL}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  // ================= CREATE ORDER =================
  createOrder(dto: CreateOrderDto): Observable<Order | null> {
    return this.http.post<Order>(this.API_URL, dto).pipe(
      tap(order => {
        this.ordersSubject.next([
          ...this.ordersSubject.value,
          order
        ]);
      }),
      catchError(() => of(null))
    );
  }

  // ================= CANCEL ORDER =================
  cancelOrder(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.ordersSubject.next(
          this.ordersSubject.value.filter(o => o.id !== id)
        );
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  // ================= CACHE =================
  getCachedOrders(): Order[] {
    return this.ordersSubject.value;
  }
}