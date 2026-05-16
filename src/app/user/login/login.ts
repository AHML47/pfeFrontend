import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

/**
 * Modern customer authentication view handling login and registration modes.
 * Uses floating-label inputs and animated visual shell.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  isRegisterMode = false;
  loginEmail = '';
  loginPassword = '';
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerAddress = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  /** Switches between login and register views and resets entered data. */
  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.resetForm();
  }

  /** Clears form values and error state. */
  resetForm(): void {
    this.error = '';
    this.loginEmail = '';
    this.loginPassword = '';
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.registerAddress = '';
  }

  /** Validates and executes customer login. */
  login(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (result) => {
        this.loading = false;
        result ? this.router.navigate(['/user/home']) : (this.error = 'Erreur de connexion');
      },
      error: () => {
        this.loading = false;
        this.error = 'Email ou mot de passe incorrect';
      },
    });
  }

  /** Validates and creates a new customer account. */
  register(): void {
    if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService
      .register(this.registerName, this.registerEmail, this.registerPassword, this.registerAddress)
      .subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.isRegisterMode = false;
            this.resetForm();
          } else {
            this.error = 'Erreur lors de la création du compte';
          }
        },
        error: () => {
          this.loading = false;
          this.error = 'Erreur serveur';
        },
      });
  }
}
