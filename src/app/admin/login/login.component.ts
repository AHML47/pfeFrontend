import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

/**
 * Admin authentication screen with secure role validation.
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private router: Router, private auth: AuthService) {}

  /** Authenticates user and grants access only for admin role. */
  login(): void {
    this.loading = true;
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const role = this.auth.getRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.error = 'Accès refusé — compte non administrateur.';
          this.auth.logout();
        }
      },
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
