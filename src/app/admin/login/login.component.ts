import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

/** Admin-only login screen with floating labels and animated organic background. */
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
  login(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        if (this.auth.getRole() === 'Admin') this.router.navigate(['/admin/dashboard']);
        else { this.error = 'Accès refusé — pas un admin'; this.auth.logout(); }
      },
      error: () => { this.error = 'Email ou mot de passe incorrect'; this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }
}
