import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateAchatLotDto } from '../models/create-achat-lot.dto';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiAchat = environment.apiEndpoint + '/AchatLot';
  private apiStock = environment.apiEndpoint + '/Stock';

  constructor(private http: HttpClient) {}

  // =========================
  // ACHAT
  // =========================
  addAchatLot(dto: CreateAchatLotDto): Observable<any> {
    return this.http.post<any>(this.apiAchat, dto);
  }

  getAllAchatLots(): Observable<any[]> {
    return this.http.get<any[]>(this.apiAchat);
  }

  // =========================
  // STOCK
  // =========================
  getAllStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiStock);
  }

  getStockByProduct(produitId: number): Observable<any> {
    return this.http.get<any>(`${this.apiStock}/${produitId}`);
  }
}