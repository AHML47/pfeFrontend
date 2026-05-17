import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BackendProduct, Product } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<BackendProduct[]>('/api/products').pipe(
      map((products) => products.map((p) => this.mapProduct(p)))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<BackendProduct>(`/api/products/${id}`).pipe(
      map((product) => this.mapProduct(product)),
      catchError(() =>
        this.getProducts().pipe(
          map((products) => products.find((product) => Number(product.id) === id))
        )
      )
    );
  }

  getPriceHistory(id: number): Observable<{ prixVenteId: number; valeur: number; date?: string }[]> {
    return this.http
      .get<Array<{ Id?: number; id?: number; Valeur?: number; valeur?: number; Date?: string; date?: string }>>(
        `/api/products/${id}/prix`
      )
      .pipe(
        map((prices) =>
          prices.map((price) => ({
            prixVenteId: this.toNumber(price.Id ?? price.id),
            valeur: this.toNumber(price.Valeur ?? price.valeur),
            date: price.Date ?? price.date
          }))
        )
      );
  }

  addPrice(id: number, valeur: number): Observable<{ prixVenteId: number }> {
    return this.http
      .post<{ PrixVenteId?: number; prixVenteId?: number }>(`/api/products/${id}/prix`, {
        idP: id,
        Valeur: valeur
      })
      .pipe(map((res) => ({ prixVenteId: this.toNumber(res.PrixVenteId ?? res.prixVenteId) })));
  }

  createProduct(formData: FormData): Observable<number> {
    return this.http.post<number>('/api/products', formData);
  }

  updateProduct(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`/api/products/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`/api/products/${id}`);
  }

  private toRelativePath(url: string): string {
    try { return new URL(url).pathname; } catch { return url; }
  }

  private mapProduct(bp: BackendProduct): Product {
    const rawImageUrl =
      bp.imageUrl ??
      bp.ImageUrl ??
      (bp.imagePath ? `/uploads/${bp.imagePath}` : '');
    const imageUrl = rawImageUrl ? this.toRelativePath(rawImageUrl) : '';
    return {
      id: this.toNumber(bp.idP ?? bp.Id ?? bp.id),
      name: bp.libelle ?? bp.Libelle ?? '',
      price: this.toNumber(
        bp.prixVenteActuel ??
          bp.PrixVenteActuel ??
          bp.prixVente ??
          bp.PrixVente ??
          bp.prix ??
          bp.prixAchat
      ),
      imageUrl,
      categoryId: this.toNumber(bp.idCategorie ?? bp.IdCategorie ?? bp.categoryId),
      description: bp.description ?? bp.Description,
      nbUnite: this.toNumber(bp.nbUnite ?? bp.NbUnite, 0),
      seuil: this.toNumber(bp.seuil ?? bp.Seuil, 0),
      prixModifiable: bp.prixModifiable ?? bp.PrixModifiable
    };
  }

  private toNumber(value: number | string | null | undefined, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}
