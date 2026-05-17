import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AchatLot } from '../../user.products';

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
          achatLotId: res.AchatLotId ?? 0
        }))
      );
  }

  getAchatLots(): Observable<AchatLot[]> {
    return this.http.get<AchatLot[]>('/api/achatlot');
  }

  getAchatLot(id: number): Observable<AchatLot> {
    return this.http.get<AchatLot>(`/api/achatlot/${id}`);
  }

  deleteAchatLot(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message?: string; Message?: string }>(`/api/achatlot/${id}`)
      .pipe(map((res) => ({ message: res.message ?? res.Message ?? '' })));
  }
}
