import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

/**
 * Global top navigation with auth controls, cart indicator, theme toggle and language direction toggle.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  cartCount = 0;
  isDark = false;
  language: 'en' | 'fr' | 'ar' = 'fr';

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.updateCartCount();
  }

  /** Updates the cart badge count from current cart state. */
  updateCartCount(): void {
    this.cartCount = this.cartService.getCart().length;
  }

  /** Logs out current user and redirects to user login page. */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/user/login']);
  }

  /** Toggles root dark class for global light/dark themes. */
  toggleTheme(): void {
    this.isDark = !this.isDark;
    this.document.documentElement.classList.toggle('dark', this.isDark);
  }

  /** Applies language and logical text direction to the document root. */
  setLanguage(language: 'en' | 'fr' | 'ar'): void {
    this.language = language;
    this.document.documentElement.lang = language;
    this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
}
