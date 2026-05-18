import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StockDetailsApi, StockItem, StockLot } from '../../user.products';

export interface AddStockLotDto {
  achatLotId: number;
  quantite: number;
  prixAchatTotal: number;
  fournisseur: string;
  unite?: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly http = inject(HttpClient);

  getStock(): Observable<StockItem[]> {
    return this.http.get<StockDetailsApi[]>('/api/stock').pipe(
      map((items) => items.map((item) => this.mapStock(item)))
    );
  }

  getProductStock(produitId: number): Observable<StockLot[]> {
    return this.http.get<StockLot[]>(`/api/stock/${produitId}`);
  }

  addStockLot(dto: AddStockLotDto): Observable<number> {
    return this.http.post<number>('/api/stock', {
      AchatLotId: dto.achatLotId,
      Quantite: dto.quantite,
      PrixAchatTotal: dto.prixAchatTotal,
      Fournisseur: dto.fournisseur,
      Unite: dto.unite
    });
  }

  private mapStock(item: StockDetailsApi): StockItem {
    const raw: any = (item as any).Product ?? (item as any).product ?? {};
    const produitId = raw.idP ?? raw.Id ?? raw.produitId ?? 0;
    const libelle = raw.libelle ?? raw.Libelle ?? raw.name ?? raw.nom ?? '';
    const quantite = (item as any).QuantiteTotalRestante ?? (item as any).quantiteTotalRestante ?? 0;
    const seuil = raw.seuil ?? raw.Seuil ?? undefined;
    const categorie = raw.categorie?.name ?? raw.categorie ?? undefined;
    const numeroLot = raw.stockLots?.[0]?.NumeroLot ?? raw.stockLots?.[0]?.numeroLot ?? undefined;

    return {
      produitId,
      libelle,
      quantiteDisponible: quantite,
      seuil,
      categorie,
      numeroLot
    };
  }
}
