import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html'
})
export class FooterComponent {
  constructor(private readonly router: Router) {}

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  readonly quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'Products', route: '/products' },
    { label: 'Cart', route: '/cart' },
    { label: 'Login', route: '/login' },
    { label: 'Register', route: '/register' }
  ];
}
