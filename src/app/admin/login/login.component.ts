import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';

    // Validation simple admin
    if (this.email === 'admin@deliverwholesale.com' && this.password === 'admin123') {
      localStorage.setItem('adminToken', 'token123');
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error = 'Email ou mot de passe incorrect';
    }

    this.loading = false;
  }
}
