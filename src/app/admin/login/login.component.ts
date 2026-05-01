import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

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

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    console.log("Im here", this.email, this.password);
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const role = this.auth.getRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.error = 'Accès refusé — pas un admin';
          this.auth.logout();
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}