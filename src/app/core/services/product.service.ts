import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BackendProduct, Product } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<BackendProduct[]>('/api/products').pipe(
      map((products) => products.map((p) => this.mapProduct(p)))
    );
  }

  getPriceHistory(id: number): Observable<{ prixVenteId: number; valeur: number; date?: string }[]> {
    return this.http.get<{ prixVenteId: number; valeur: number; date?: string }[]>(
      `/api/products/${id}/prix`
    );
  }

  addPrice(id: number, valeur: number): Observable<{ prixVenteId: number }> {
    return this.http.post<{ prixVenteId: number }>(`/api/products/${id}/prix`, { valeur });
  }

  createProduct(formData: FormData): Observable<BackendProduct> {
    return this.http.post<BackendProduct>('/api/products', formData);
  }

  updateProduct(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`/api/products/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`/api/products/${id}`);
  }

  private mapProduct(bp: BackendProduct): Product {
    return {
      id: bp.id,
      name: bp.libelle,
      price: bp.prixVente,
      imageUrl: bp.imagePath ? `/uploads/${bp.imagePath}` : '',
      categoryId: bp.idCategorie,
      description: bp.description,
      nbUnite: bp.nbUnite,
      seuil: bp.seuil,
      prixModifiable: bp.prixModifiable
    };
  }
}
