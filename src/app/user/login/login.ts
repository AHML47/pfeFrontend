import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  // Mode
  isRegisterMode: boolean = false;
  isAdminMode: boolean = false;

  // Login
  loginEmail: string = '';
  loginPassword: string = '';

  // Register
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  registerAddress: string = ''; // ✅ AJOUT ADDRESS

  // Admin
  adminEmail: string = '';
  adminPassword: string = '';

  // State
  error: string = '';
  errorAdmin: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.resetForm();
  }

  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    this.resetForm();
  }

  resetForm() {
    this.error = '';
    this.errorAdmin = '';
    this.loginEmail = '';
    this.loginPassword = '';
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.registerAddress = ''; // ✅ RESET ADDRESS
    this.adminEmail = '';
    this.adminPassword = '';
  }

  // ================= LOGIN =================
  login() {
    this.error = '';

    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (!this.loginEmail.includes('@')) {
      this.error = 'Email invalide';
      return;
    }

    if (this.loginPassword.length < 3) {
      this.error = 'Le mot de passe doit contenir au moins 3 caractères';
      return;
    }

    this.loading = true;

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (result) => {
        if (result) {
          this.router.navigate(['/user/home']);
        } else {
          this.error = 'Erreur de connexion';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }

  // ================= REGISTER =================
  register() {
    this.error = '';

    if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.registerName.trim().length < 2) {
      this.error = 'Le nom doit contenir au moins 2 caractères';
      return;
    }

    if (!this.registerEmail.includes('@')) {
      this.error = 'Email invalide';
      return;
    }

    if (this.registerPassword.length < 3) {
      this.error = 'Le mot de passe doit contenir au moins 3 caractères';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;

    // ✅ AJOUT ADDRESS ICI (sans changer logique)
    this.authService.register(
      this.registerName,
      this.registerEmail,
      this.registerPassword,
      this.registerAddress
    ).subscribe({
      next: (success) => {
        if (success) {
          alert('Compte créé avec succès! Vous êtes connecté.');
          this.router.navigate(['/user/home']);
        } else {
          this.error = 'Erreur lors de la création du compte';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur serveur';
        this.loading = false;
      }
    });
  }

  // ================= ADMIN =================
  adminLogin() {
    this.errorAdmin = '';

    if (!this.adminEmail || !this.adminPassword) {
      this.errorAdmin = 'Veuillez remplir tous les champs';
      return;
    }

    if (!this.adminEmail.includes('@')) {
      this.errorAdmin = 'Email invalide';
      return;
    }

    this.loading = true;

    setTimeout(() => {
      if (this.adminEmail === 'admin@deliverwholesale.com' && this.adminPassword === 'admin123') {
        localStorage.setItem('adminToken', 'token123');
        localStorage.setItem('adminEmail', this.adminEmail);
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorAdmin = 'Email ou mot de passe admin incorrect';
      }
      this.loading = false;
    }, 500);
  }
}