import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product, ProductFormData } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API_URL = `${environment.apiEndpoint}/products`;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔹 GET ALL
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      tap(res => {
        console.log("API RESPONSE:", res); // 🔥 DEBUG
        this.productsSubject.next(res);
      }),
      catchError(error => {
        console.error("Erreur GET:", error);
        return of([]);
      })
    );
  }

  // 🔹 GET BY ID
  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.API_URL}/${id}`).pipe(
      tap(res => console.log("Produit trouvé:", res)),
      catchError(error => {
        console.error("Erreur GET BY ID:", error);
        return of(null);
      })
    );
  }

  // 🔹 ADD
  addProduct(data: ProductFormData): Observable<Product | null> {
    return this.http.post<Product>(this.API_URL, data).pipe(
      tap(p => {
        console.log("Produit ajouté:", p);
        this.productsSubject.next([...this.productsSubject.value, p]);
      }),
      catchError(error => {
        console.error("Erreur ADD:", error);
        return of(null);
      })
    );
  }

  // 🔹 UPDATE
  updateProduct(id: number, data: ProductFormData): Observable<Product | null> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, data).pipe(
      tap(updated => {
        console.log("Produit modifié:", updated);
        const list = this.productsSubject.value.map(p =>
          p.id === id ? updated : p
        );
        this.productsSubject.next(list);
      }),
      catchError(error => {
        console.error("Erreur UPDATE:", error);
        return of(null);
      })
    );
  }

  // 🔹 DELETE
  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        console.log("Produit supprimé:", id);
        this.productsSubject.next(
          this.productsSubject.value.filter(p => p.id !== id)
        );
      }),
      map(() => true),
      catchError(error => {
        console.error("Erreur DELETE:", error);
        return of(false);
      })
    );
  }
}