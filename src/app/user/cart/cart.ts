import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CartItem } from '../../user.products';

declare const gsap: any;

@Component({
  selector: 'app-user-cart',
  imports: [CommonModule, TranslateModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements AfterViewInit {
  @ViewChildren('cartCard') cartCards!: QueryList<ElementRef<HTMLElement>>;

  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  readonly items = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;

  orderSuccess = false;
  orderError = '';
  isSubmitting = false;

  get shipping(): number {
    return this.items().length ? 8 : 0;
  }

  get total(): number {
    return this.subtotal() + this.shipping;
  }

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  private animateEntrance(): void {
    if (typeof gsap === 'undefined') return;
    const isRtl = document?.documentElement?.dir === 'rtl';
    gsap.from(this.cartCards.map((card) => card.nativeElement), {
      x: isRtl ? -80 : 80,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }

  removeItem(item: CartItem, event?: Event): void {
    const card = (event?.currentTarget as HTMLElement | null)?.closest(
      '[data-cart-card]'
    ) as HTMLElement | null;

    if (typeof gsap === 'undefined' || !card) {
      this.cartService.removeItem(item.product.id);
      return;
    }

    gsap.to(card, {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      scaleY: 0.92,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => this.cartService.removeItem(item.product.id)
    });
  }

  updateQuantity(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + delta);
  }

  checkout(): void {
    if (!this.items().length || this.isSubmitting) return;
    this.isSubmitting = true;
    this.orderError = '';

    this.orderService.createOrder(this.cartService.toOrderPayload()).subscribe({
      next: () => {
        this.orderSuccess = true;
        this.cartService.clear();
        this.isSubmitting = false;
      },
      error: () => {
        this.orderError = 'La commande a échoué. Veuillez réessayer.';
        this.isSubmitting = false;
      }
    });
  }
}
