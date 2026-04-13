import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private cart$ = new BehaviorSubject<CartItem[]>([]);
  public cart = this.cart$.asObservable();

  constructor(private authService: AuthService) {}

  addToCart(product: any): boolean {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    const currentCart = this.cart$.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
    }
    
    this.cart$.next([...currentCart]);
    console.log('Produit ajouté au panier:', product.name);
    return true;
  }

  getCart(): CartItem[] {
    return this.cart$.value;
  }

  removeFromCart(id: number) {
    const currentCart = this.cart$.value;
    const updatedCart = currentCart.filter(item => item.id !== id);
    this.cart$.next(updatedCart);
  }

  clearCart() {
    this.cart$.next([]);
  }
}
