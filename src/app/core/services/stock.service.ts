import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockItem } from '../../user.products';

export interface AddStockLotDto {
  produitId: number;
  quantite: number;
  prixUnitaire: number;
  fournisseur: string;
  numeroLot: string;
  typeMouvement?: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly http = inject(HttpClient);

  getStock(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>('/api/stock');
  }

  getProductStock(produitId: number): Observable<StockItem> {
    return this.http.get<StockItem>(`/api/stock/${produitId}`);
  }

  addStockLot(dto: AddStockLotDto): Observable<unknown> {
    return this.http.post('/api/stock', dto);
  }
}
