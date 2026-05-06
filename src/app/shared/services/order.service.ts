import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private API_URL = `${environment.apiEndpoint}/order`;

  constructor(private http: HttpClient) {}

  // ================= ADMIN =================
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL);
  }

  // ================= USER =================
  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/user/${userId}`);
  }

  // ================= COMMON =================
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${id}`);
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/cancel`, {});
  }

  createOrder(dto: any): Observable<any> {
    return this.http.post(this.API_URL, dto);
  }

  // ================= FIXED HERE =================
  updateOrderStatus(id: number, statut: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/status`, { statut });
  }
}