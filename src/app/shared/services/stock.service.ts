import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateAchatLotDto } from '../models/create-achat-lot.dto';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiAchatLot = `${environment.apiEndpoint}/AchatLot`;
  private apiStockLot = `${environment.apiEndpoint}/StockLot`;

  constructor(private http: HttpClient) {}

  // ─────────────────────────────
  // AchatLot (POST + GET)
  // ─────────────────────────────

  addAchatLot(dto: CreateAchatLotDto): Observable<any> {
    return this.http.post<any>(this.apiAchatLot, dto);
  }

  getAllAchatLots(): Observable<any[]> {
    return this.http.get<any[]>(this.apiAchatLot);
  }

  // ─────────────────────────────
  // StockLot (GET)
  // ─────────────────────────────

  getAllStockLots(): Observable<any[]> {
    return this.http.get<any[]>(this.apiStockLot);
  }
}