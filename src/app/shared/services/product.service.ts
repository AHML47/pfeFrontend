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

  private API_URL = `${environment.apiEndpoint}/Products`;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      tap(res => this.productsSubject.next(res)),
      catchError(error => {
        console.error('Erreur GET produits:', error);
        return of([]);
      })
    );
  }
addProduct(data: ProductFormData): Observable<Product | null> {
  const formData = new FormData();
  formData.append('Nom', data.nom);
  formData.append('Description', data.description);
formData.append('Prix', data.prix.toString());  
  formData.append('NbUnite', data.nbUnite.toString());
  formData.append('CategorieId', data.categorieId.toString());

  return this.http.post<Product>(this.API_URL, formData).pipe(
    tap(p => {
      this.productsSubject.next([...this.productsSubject.value, p]);
    }),
    catchError(error => {
      console.error('Erreur ADD produit:', error.error);
       console.error('Validation errors:', JSON.stringify(error.error?.errors));
      return of(null);
    })
  );
}

updateProduct(id: number, data: ProductFormData): Observable<Product | null> {
  const formData = new FormData();
  formData.append('Nom', data.nom);
  formData.append('Description', data.description);
  formData.append('PrixAchat', data.prix.toString());  // ← Prix → PrixAchat
  formData.append('NbUnite', data.nbUnite.toString());
  formData.append('CategorieId', data.categorieId.toString());

  return this.http.put<Product>(`${this.API_URL}/${id}`, formData).pipe(
    tap(updated => {
      const list = this.productsSubject.value.map(p =>
        p.id === id ? updated : p
      );
      this.productsSubject.next(list);
    }),
    catchError(error => {
      console.error('Erreur UPDATE produit:', error.error);
      console.error('Validation errors:', JSON.stringify(error.error?.errors));
      return of(null);
    })
  );
}
  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.productsSubject.next(
          this.productsSubject.value.filter(p => p.id !== id)
        );
      }),
      map(() => true),
      catchError(error => {
        console.error('Erreur DELETE produit:', error);
        return of(false);
      })
    );
  }
}