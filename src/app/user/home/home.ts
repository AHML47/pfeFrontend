import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import gsap from '../../shared/gsap-lite';
import { ProductCardComponent } from '../products/product-card/product-card';
import { Category, Product } from '../../user.products';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, TranslateModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection', { static: true }) heroSectionRef!: ElementRef<HTMLElement>;
  @ViewChildren('heroWord') heroWords!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('parallaxText') parallaxText!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('orb') parallaxOrbs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('bentoCard') bentoCards!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('productCard') productCards!: QueryList<ElementRef<HTMLElement>>;

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  categories: Category[] = [];
  featuredProducts: Product[] = [];

  private handleScroll = () => this.updateParallax();

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 4);
        queueMicrotask(() => this.setupProductScrollReveal());
      }
    });

    this.categoryService.getCategories().subscribe({
      next: (cats) => (this.categories = cats)
    });
  }

  ngAfterViewInit(): void {
    this.animateHeroReveal();
    this.setupBentoHover();
    this.updateParallax();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onBentoMove(event: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    card.classList.add('is-active');
  }

  onBentoLeave(card: HTMLElement): void {
    card.classList.remove('is-active');
  }

  private animateHeroReveal(): void {
    gsap.fromTo(
      this.heroWords.map((item) => item.nativeElement),
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.15, stagger: 0.08 }
    );
  }

  private setupBentoHover(): void {
    this.bentoCards.forEach((cardRef) => {
      const card = cardRef.nativeElement;
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  }

  private setupProductScrollReveal(): void {
    this.productCards.forEach((cardRef) => {
      const card = cardRef.nativeElement;
      card.style.opacity = '0';
      card.style.transform = 'translateY(48px)';
    });
    this.revealProductsInView();
  }

  private revealProductsInView(): void {
    this.productCards.forEach((cardRef, index) => {
      const card = cardRef.nativeElement;
      const inView = card.getBoundingClientRect().top < window.innerHeight * 0.9;
      if (!inView || card.dataset['revealed']) return;
      card.dataset['revealed'] = 'true';
      gsap.to(card, { y: 0, opacity: 1, duration: 1, stagger: index * 0.05, ease: 'elastic.out(1, 0.5)' });
    });
  }

  private updateParallax(): void {
    const hero = this.heroSectionRef.nativeElement;
    const progress = Math.min(Math.max(-hero.getBoundingClientRect().top / window.innerHeight, 0), 1.2);

    this.parallaxText.forEach((item, i) => {
      gsap.to(item.nativeElement, { y: -progress * (110 + i * 22), duration: 0.25 });
    });

    this.parallaxOrbs.forEach((item, i) => {
      gsap.to(item.nativeElement, { y: progress * (35 + i * 18), duration: 0.25 });
    });

    this.revealProductsInView();
  }
}
