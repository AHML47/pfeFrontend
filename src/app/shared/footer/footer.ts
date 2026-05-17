import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html'
})
export class FooterComponent {
  readonly quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'Products', route: '/products' },
    { label: 'Cart', route: '/cart' },
    { label: 'Login', route: '/login' },
    { label: 'Register', route: '/register' }
  ];
}
