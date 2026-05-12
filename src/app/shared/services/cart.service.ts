import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // ✅ Charger depuis localStorage
  private cart$ = new BehaviorSubject<CartItem[]>(
    JSON.parse(localStorage.getItem('cart') || '[]')
  );

  public cart = this.cart$.asObservable();

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  // ✅ Sauvegarde automatique
  private saveCart(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addToCart(product: any): Observable<boolean> {

  const currentCart = this.cart$.value;

  const existingItem = currentCart.find(item => item.id === product.id);

  const price =
    product.prixVente ??
    product.prixAchat ??
    product.price ??
    0;

  if (existingItem) {
    existingItem.quantity++;
  } else {
    currentCart.push({
      id: product.id,
      name: product.nom || product.name,
      price: price,
      quantity: 1,
      image: product.image || ''
    });
  }

  this.cart$.next([...currentCart]);

  // ✅🔥 AJOUT IMPORTANT
  this.saveCart(currentCart);

  return of(true);
}
  removeFromCart(id: number): Observable<void> {
    const updatedCart = this.cart$.value.filter(item => item.id !== id);
    this.cart$.next(updatedCart);
    this.saveCart(updatedCart); // ✅ IMPORTANT
    return of(void 0);
  }

  clearCart(): Observable<void> {
    this.cart$.next([]);
    localStorage.removeItem('cart'); // ✅ IMPORTANT
    return of(void 0);
  }

  getCart(): CartItem[] {
    return this.cart$.value;
  }

  getTotalPrice(): number {
    return this.cart$.value.reduce(
      (total, item) => total + ((item.price || 0) * (item.quantity || 0)),
      0
    );
  }

  getTotalItems(): number {
    return this.cart$.value.reduce((total, item) => total + item.quantity, 0);
  }
}