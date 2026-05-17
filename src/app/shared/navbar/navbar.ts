import { CommonModule } from '@angular/common';
import { Component, ElementRef, afterNextRender, inject, viewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { App } from '../../app';
import { AuthService } from '../../core/services/auth.service';
import { PanierService } from '../../core/services/panier.service';

declare global {
  interface Window {
    gsap?: {
      fromTo?: (...args: unknown[]) => void;
      to: (...args: unknown[]) => void;
      quickTo?: (target: Element, property: string, vars: Record<string, unknown>) => (value: number) => void;
    };
  }
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  private readonly links = viewChildren<ElementRef<HTMLElement>>('liquidLink');
  private readonly actionButtons = viewChildren<ElementRef<HTMLElement>>('magneticBtn');
  private readonly router = inject(Router);
  private readonly app = inject(App);
  private readonly panierService = inject(PanierService);
  readonly auth = inject(AuthService);
  readonly cartCount = this.panierService.count;
  currentLanguage: 'en' | 'fr' | 'ar' = 'en';

  get isDarkMode(): boolean {
    return this.app.isDarkMode();
  }

  readonly navLinks = [
    { key: 'NAV.HOME', route: '/' },
    { key: 'NAV.PRODUCTS', route: '/products' },
    { key: 'NAV.CART', route: '/cart' }
  ];

  constructor() {
    afterNextRender(() => {
      this.initializeGsapHover();
      this.initializeMagneticButtons();
      if (this.auth.isAuthenticated()) {
        this.panierService.getPanier().subscribe();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  toggleTheme(): void {
    this.app.toggleTheme();
  }

  changeLanguage(value: string): void {
    const lang: 'en' | 'fr' | 'ar' = value === 'ar' ? 'ar' : value === 'fr' ? 'fr' : 'en';
    this.currentLanguage = lang;
    this.app.applyLanguage(lang);
  }

  private initializeGsapHover(): void {
    if (!window.gsap) return;
    this.links().forEach((linkRef) => {
      const element = linkRef.nativeElement;
      element.addEventListener('mouseenter', () =>
        window.gsap?.fromTo?.(
          element,
          { backgroundPositionX: '120%' },
          { backgroundPositionX: '0%', duration: 0.6 }
        )
      );
    });
  }

  private initializeMagneticButtons(): void {
    if (!window.gsap) return;
    this.actionButtons().forEach((buttonRef) => {
      const element = buttonRef.nativeElement;
      element.addEventListener('mouseenter', () =>
        window.gsap?.to(element, { scale: 1.04, duration: 0.25 })
      );
      element.addEventListener('mouseleave', () =>
        window.gsap?.to(element, { scale: 1, duration: 0.25 })
      );
    });
  }
}
