import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

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
  private cart$ = new BehaviorSubject<CartItem[]>([]);
  public cart = this.cart$.asObservable();

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  addToCart(product: any): Observable<boolean> {
    if (!this.authService.isLoggedIn()) return of(false);

    const currentCart = this.cart$.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
      this.cart$.next([...currentCart]);
    } else {
      this.cart$.next([...currentCart, {
        id: product.id,
        name: product.nom || product.name,
        price: product.prixVente || product.price,
        quantity: 1,
        image: product.image || ''
      }]);
    }
    return of(true);
  }

  removeFromCart(id: number): Observable<void> {
    const updatedCart = this.cart$.value.filter(item => item.id !== id);
    this.cart$.next(updatedCart);
    return of(void 0);
  }

  clearCart(): Observable<void> {
    this.cart$.next([]);
    return of(void 0);
  }

  getCart(): CartItem[] {
    return this.cart$.value;
  }

  getTotalPrice(): number {
    return this.cart$.value.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotalItems(): number {
    return this.cart$.value.reduce((total, item) => total + item.quantity, 0);
  }
}