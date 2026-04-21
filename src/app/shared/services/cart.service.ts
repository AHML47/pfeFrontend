import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// ─── DTOs pour correspondre au backend .NET ───────────────────────
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = `${environment.apiEndpoint}/cart`;

  private cart$ = new BehaviorSubject<CartItem[]>([]);
  public cart = this.cart$.asObservable();

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Charger le panier depuis l'API si déjà connecté au démarrage
    if (this.authService.isLoggedIn()) {
      this.loadCartFromApi().subscribe();
    }
  }

  // ─── LOAD ──────────────────────────────────────────────────────

  private loadCartFromApi(): Observable<CartItem[]> {
    return this.http.get<CartResponse>(this.API_URL).pipe(
      tap(response => this.cart$.next(response.items)),
      map(response => response.items),
      catchError(() => {
        this.cart$.next([]);
        return of([]);
      })
    );
  }

  // ─── ADD ───────────────────────────────────────────────────────

  addToCart(product: any): Observable<boolean> {
    // Même vérification qu'avant
    if (!this.authService.isLoggedIn()) {
      return of(false);
    }

    const currentCart = this.cart$.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    // Même logique qu'avant : incrémenter ou ajouter
    const body: AddToCartRequest = {
      productId: product.id,
      quantity: existingItem ? existingItem.quantity + 1 : 1
    };

    return this.http.post<CartResponse>(this.API_URL, body).pipe(
      tap(response => {
        this.cart$.next(response.items);
        console.log('Produit ajouté au panier:', product.name);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  // ─── REMOVE ────────────────────────────────────────────────────

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        // Même logique qu'avant
        const updatedCart = this.cart$.value.filter(item => item.id !== id);
        this.cart$.next(updatedCart);
      }),
      catchError(() => of(void 0))
    );
  }

  // ─── CLEAR ─────────────────────────────────────────────────────

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.API_URL).pipe(
      tap(() => this.cart$.next([])),  // Même logique qu'avant
      catchError(() => of(void 0))
    );
  }

  // ─── HELPERS ───────────────────────────────────────────────────

  getCart(): CartItem[] {
    return this.cart$.value;
  }
}