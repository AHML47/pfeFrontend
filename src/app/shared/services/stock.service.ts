import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CreateAchatLotDto } from '../models/create-achat-lot.dto';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiAchatLot = `${environment.apiEndpoint}/AchatLot`;

  // 🔴 FIX IMPORTANT : backend = StockController => /api/Stock
  private apiStock = `${environment.apiEndpoint}/Stock`;

  constructor(private http: HttpClient) {}

  // ─────────────────────────────
  // AchatLot
  // ─────────────────────────────

  addAchatLot(dto: CreateAchatLotDto): Observable<any> {
    return this.http.post<any>(this.apiAchatLot, dto);
  }

  getAllAchatLots(): Observable<any[]> {
    return this.http.get<any[]>(this.apiAchatLot);
  }

  // ─────────────────────────────
  // STOCK (CORRIGÉ)
  // ─────────────────────────────

  getAllStockLots(): Observable<any[]> {
    return this.http.get<any[]>(this.apiStock).pipe(
      tap(data => console.log('STOCK API RESPONSE:', data))
    );
  }

  getProductStock(produitId: number): Observable<any> {
    return this.http.get<any>(`${this.apiStock}/${produitId}`);
  }
}