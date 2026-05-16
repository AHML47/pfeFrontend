import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard implements AfterViewInit, OnDestroy {
  @Input({ required: true }) product!: Record<string, unknown>;

  get stock(): number { return Number(this.product['stock'] ?? 0); }
  get image(): string { return String(this.product['image'] ?? ''); }
  get title(): string { return String(this.product['nom'] ?? this.product['name'] ?? 'Produit'); }
  get category(): string { return String(this.product['categorieNom'] ?? this.product['category'] ?? ''); }
  get description(): string { return String(this.product['description'] ?? ''); }
  get price(): number { return Number(this.product['prixAchat'] ?? this.product['prix'] ?? this.product['price'] ?? 0); }

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    const card = this.elementRef.nativeElement.querySelector('.product-card') as HTMLElement | null;
    if (!card) return;
    card.addEventListener('mousemove', this.onCardMove);
    card.addEventListener('mouseleave', this.onLeave);
  }

  ngOnDestroy(): void {
    const card = this.elementRef.nativeElement.querySelector('.product-card') as HTMLElement | null;
    if (!card) return;
    card.removeEventListener('mousemove', this.onCardMove);
    card.removeEventListener('mouseleave', this.onLeave);
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter un produit au panier');
      this.router.navigate(['/user/login']);
      return;
    }

    const productNormalized = {
      id: this.product['id'],
      name: (this.product['nom'] as string) ?? (this.product['name'] as string),
      price: (this.product['prixAchat'] as number) ?? (this.product['prix'] as number) ?? (this.product['prixVente'] as number) ?? (this.product['price'] as number) ?? 0,
      image: (this.product['image'] as string) ?? ''
    };

    this.cartService.addToCart(productNormalized);
    alert(`${productNormalized.name} a été ajouté au panier!`);
  }

  goToDetails(): void {
    this.router.navigate(['/user/products/details', this.product['id']]);
  }

  private readonly onCardMove = (event: MouseEvent): void => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    target.style.setProperty('--rx', `${rx}deg`);
    target.style.setProperty('--ry', `${ry}deg`);
    target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    target.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  private readonly onLeave = (event: MouseEvent): void => {
    const target = event.currentTarget as HTMLElement;
    target.style.setProperty('--rx', '0deg');
    target.style.setProperty('--ry', '0deg');
  };
}
