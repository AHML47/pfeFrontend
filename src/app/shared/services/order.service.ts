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

  // GET ALL ORDERS
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL);
  }

  // GET BY ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${id}`);
  }

  // CREATE ORDER
  createOrder(dto: any): Observable<any> {
    return this.http.post(this.API_URL, dto);
  }

  // DELETE ORDER
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // CANCEL ORDER
  cancelOrder(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/cancel`, {});
  }
}




