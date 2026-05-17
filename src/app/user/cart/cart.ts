import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PanierService } from '../../core/services/panier.service';
import { PanierItemDto } from '../../user.products';

declare const gsap: any;

@Component({
  selector: 'app-user-cart',
  imports: [CommonModule, TranslateModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit, AfterViewInit {
  @ViewChildren('cartCard') cartCards!: QueryList<ElementRef<HTMLElement>>;

  private readonly panierService = inject(PanierService);

  readonly panier = this.panierService.panier;
  readonly items = computed(() => this.panier()?.Items ?? []);
  readonly total = computed(() => this.panier()?.TotalPrix ?? 0);

  loading = false;
  orderSuccess = false;
  orderError = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.loading = true;
    this.panierService.getPanier().subscribe({
      next: () => (this.loading = false),
      error: () => (this.loading = false)
    });
  }

  ngAfterViewInit(): void {
    this.cartCards.changes.subscribe(() => this.animateEntrance());
  }

  private animateEntrance(): void {
    if (typeof gsap === 'undefined') return;
    const cards = this.cartCards.map((c) => c.nativeElement);
    if (!cards.length) return;
    gsap.from(cards, { x: 80, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
  }

  removeItem(item: PanierItemDto): void {
    this.panierService.deleteItem(item.ProduitId).subscribe();
  }

  updateQuantity(item: PanierItemDto, delta: number): void {
    const next = item.Quantite + delta;
    if (next < 1) {
      this.removeItem(item);
      return;
    }
    this.panierService.updateItem(item.ProduitId, { quantite: next }).subscribe();
  }

  checkout(): void {
    if (!this.items().length || this.isSubmitting) return;
    this.isSubmitting = true;
    this.orderError = '';

    this.panierService.checkout().subscribe({
      next: () => {
        this.orderSuccess = true;
        this.isSubmitting = false;
      },
      error: () => {
        this.orderError = 'La commande a échoué. Veuillez réessayer.';
        this.isSubmitting = false;
      }
    });
  }
}
