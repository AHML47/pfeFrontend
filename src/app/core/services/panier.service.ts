import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { PanierDto, PanierItemDto } from '../../user.products';

export interface AddToPanierDto {
  produitId: number;
  quantite: number;
}

export interface UpdatePanierItemDto {
  quantite: number;
}

export interface CheckoutResponse {
  message: string;
  orderId: number;
}

// Raw type returned by the backend — fields may be PascalCase or camelCase
type RawPanier = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class PanierService {
  private readonly http = inject(HttpClient);
  private readonly panierSignal = signal<PanierDto | null>(null);

  readonly count = computed(() =>
    this.panierSignal()?.Items?.reduce((sum, i) => sum + i.Quantite, 0) ?? 0
  );
  readonly panier = this.panierSignal.asReadonly();

  getPanier(): Observable<PanierDto> {
    return this.http
      .get<RawPanier>('/api/panier')
      .pipe(map(this.normalize), tap((p) => this.panierSignal.set(p)));
  }

  addItem(dto: AddToPanierDto): Observable<PanierDto> {
    return this.http
      .post<RawPanier>('/api/panier/items', { ProduitId: dto.produitId, Quantite: dto.quantite })
      .pipe(map(this.normalize), tap((p) => this.panierSignal.set(p)));
  }

  updateItem(produitId: number, dto: UpdatePanierItemDto): Observable<PanierDto> {
    return this.http
      .put<RawPanier>(`/api/panier/items/${produitId}`, { Quantite: dto.quantite })
      .pipe(map(this.normalize), tap((p) => this.panierSignal.set(p)));
  }

  deleteItem(produitId: number): Observable<PanierDto> {
    return this.http
      .delete<RawPanier>(`/api/panier/items/${produitId}`)
      .pipe(map(this.normalize), tap((p) => this.panierSignal.set(p)));
  }

  clear(): Observable<PanierDto> {
    return this.http
      .delete<RawPanier>('/api/panier/clear')
      .pipe(map(this.normalize), tap((p) => this.panierSignal.set(p)));
  }

  checkout(): Observable<CheckoutResponse> {
    return this.http
      .post<{ Message?: string; message?: string; OrderId?: number; orderId?: number }>(
        '/api/panier/checkout',
        {}
      )
      .pipe(
        map((res) => ({
          message: res.Message ?? res.message ?? '',
          orderId: res.OrderId ?? res.orderId ?? 0
        })),
        tap(() => this.panierSignal.set(null))
      );
  }

  private normalize = (raw: RawPanier): PanierDto => {
    const rawItems = (raw['Items'] ?? raw['items'] ?? []) as RawPanier[];
    const items: PanierItemDto[] = rawItems.map((i) => ({
      ProduitId: (i['ProduitId'] ?? i['produitId'] ?? 0) as number,
      Libelle: (i['Libelle'] ?? i['libelle'] ?? '') as string,
      Quantite: (i['Quantite'] ?? i['quantite'] ?? 0) as number,
      PrixUnitaire: (i['PrixUnitaire'] ?? i['prixUnitaire'] ?? 0) as number,
      SousTotal: (i['SousTotal'] ?? i['sousTotal'] ?? 0) as number,
      ImageUrl: (i['ImageUrl'] ?? i['imageUrl'] ?? undefined) as string | undefined
    }));
    return {
      UserId: (raw['UserId'] ?? raw['userId'] ?? 0) as number,
      TotalPrix: (raw['TotalPrix'] ?? raw['totalPrix'] ?? 0) as number,
      Items: items
    };
  };
}
