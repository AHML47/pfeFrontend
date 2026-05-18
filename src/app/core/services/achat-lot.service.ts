import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AchatLot } from '../../user.products';

interface AchatLotApi {
  id?: number;
  Id?: number;
  produitId?: number;
  ProduitId?: number;
  dateAchat?: string;
  DateAchat?: string;
  quantiteAchetee?: number;
  QuantiteAchetee?: number;
  prixUnitaire?: number;
  PrixUnitaire?: number;
  fournisseur?: string;
  Fournisseur?: string;
  supplierId?: number;
  SupplierId?: number;
  numeroLot?: string;
  NumeroLot?: string;
  stockLots?: { id?: number; Id?: number }[];
  StockLots?: { id?: number; Id?: number }[];
}

export interface CreateAchatLotDto {
  produitId: number;
  quantiteAchetee: number;
  prixUnitaire: number;
  fournisseur: string;
  supplierId?: number;
}

export interface CreateAchatLotResponse {
  message: string;
  achatLotId: number;
}

@Injectable({ providedIn: 'root' })
export class AchatLotService {
  private readonly http = inject(HttpClient);

  private mapAchatLot(lot: AchatLotApi): AchatLot {
    return {
      Id: lot.Id ?? lot.id ?? 0,
      ProduitId: lot.ProduitId ?? lot.produitId ?? 0,
      DateAchat: lot.DateAchat ?? lot.dateAchat,
      QuantiteAchetee: lot.QuantiteAchetee ?? lot.quantiteAchetee ?? 0,
      PrixUnitaire: lot.PrixUnitaire ?? lot.prixUnitaire ?? 0,
      Fournisseur: lot.Fournisseur ?? lot.fournisseur ?? '',
      SupplierId: lot.SupplierId ?? lot.supplierId,
      NumeroLot: lot.NumeroLot ?? lot.numeroLot,
      StockLots: (lot.StockLots ?? lot.stockLots)?.map((stockLot) => ({
        Id: stockLot.Id ?? stockLot.id ?? 0
      }))
    };
  }

  createAchatLot(dto: CreateAchatLotDto): Observable<CreateAchatLotResponse> {
    return this.http
      .post<{ message?: string; Message?: string; AchatLotId?: number }>(
        '/api/achatlot',
        {
          ProduitId: dto.produitId,
          QuantiteAchetee: dto.quantiteAchetee,
          PrixUnitaire: dto.prixUnitaire,
          Fournisseur: dto.fournisseur,
          SupplierId: dto.supplierId
        }
      )
      .pipe(
        map((res) => ({
          message: res.message ?? res.Message ?? '',
          achatLotId: res.AchatLotId ?? (res as { achatLotId?: number }).achatLotId ?? 0
        }))
      );
  }

  getAchatLots(): Observable<AchatLot[]> {
    return this.http.get<AchatLotApi[]>('/api/achatlot').pipe(map((lots) => lots.map((lot) => this.mapAchatLot(lot))));
  }

  getAchatLot(id: number): Observable<AchatLot> {
    return this.http.get<AchatLotApi>(`/api/achatlot/${id}`).pipe(map((lot) => this.mapAchatLot(lot)));
  }

  deleteAchatLot(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message?: string; Message?: string }>(`/api/achatlot/${id}`)
      .pipe(map((res) => ({ message: res.message ?? res.Message ?? '' })));
  }
}
