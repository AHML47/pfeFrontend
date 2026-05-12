import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AchatLotResponse } from '../models/stock-lot.model'; // ← remplace StockDetails
import { CreateAchatLotDto } from '../models/create-achat-lot.dto';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiStock = `${environment.apiEndpoint}/Stock`;
  private apiAchat = `${environment.apiEndpoint}/AchatLot`;
  private apiProduits = `${environment.apiEndpoint}/Products`;


  constructor(private http: HttpClient) {}

  // 📦 STOCK RÉEL (IMPORTANT)
  getStock(): Observable<any[]> {
  return this.http.get<any[]>(this.apiAchat);  // ← apiAchat pas apiStock
}
  // ➕ CREATE ACHAT
  createAchat(dto: CreateAchatLotDto): Observable<any> {
    return this.http.post(this.apiAchat, dto);
  }
  getProduits(): Observable<any[]> {
  return this.http.get<any[]>(this.apiProduits);
}
}