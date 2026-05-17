import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  inject
} from '@angular/core';
import gsap from '../../../shared/gsap-lite';
import { Product } from '../../../user.products';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) product!: Product;
  @ViewChild('card', { static: true }) cardRef!: ElementRef<HTMLElement>;

  private readonly cartService = inject(CartService);
  private readonly rotateAmount = 6;

  addedFeedback = false;

  addToCart(): void {
    this.cartService.addItem(this.product);
    this.addedFeedback = true;
    setTimeout(() => (this.addedFeedback = false), 1200);
  }

  ngAfterViewInit(): void {
    const card = this.cardRef.nativeElement;
    card.addEventListener('mousemove', this.onMouseMove);
    card.addEventListener('mouseleave', this.onMouseLeave);
  }

  ngOnDestroy(): void {
    const card = this.cardRef?.nativeElement;
    if (!card) return;
    card.removeEventListener('mousemove', this.onMouseMove);
    card.removeEventListener('mouseleave', this.onMouseLeave);
  }

  private onMouseMove = (event: MouseEvent) => {
    const card = this.cardRef.nativeElement;
    const rect = card.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * this.rotateAmount;
    const rotateX = -(((event.clientY - rect.top) / rect.height) - 0.5) * this.rotateAmount;
    gsap.to(card, { rotateX, rotateY, transformPerspective: 900, transformOrigin: 'center', duration: 0.3, ease: 'power2.out' });
  };

  private onMouseLeave = () => {
    gsap.to(this.cardRef.nativeElement, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power3.out' });
  };
}
