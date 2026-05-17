import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = computed(() => this.itemsSignal());
  readonly count = computed(() =>
    this.itemsSignal().reduce((acc, i) => acc + i.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  );

  addItem(product: Product, quantity = 1): void {
    this.itemsSignal.update((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...current, { product, quantity }];
    });
  }

  removeItem(productId: number): void {
    this.itemsSignal.update((current) => current.filter((i) => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.itemsSignal.update((current) =>
      current.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }

  clear(): void {
    this.itemsSignal.set([]);
  }

  toOrderPayload(): { produitId: number; quantite: number }[] {
    return this.itemsSignal().map((i) => ({ produitId: i.product.id, quantite: i.quantity }));
  }
}
