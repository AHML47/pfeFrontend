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
  // Mode (login ou register)
  isRegisterMode: boolean = false;

  // Admin mode
  isAdminMode: boolean = false;

  // Login fields
  loginEmail: string = '';
  loginPassword: string = '';

  // Register fields
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';

  // Admin fields
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
    this.adminEmail = '';
    this.adminPassword = '';
  }

  login() {
    console.log('Login called'); // Debug
    this.error = '';

    // Validation
    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Veuillez remplir tous les champs';
      console.log('Email ou password vide');
      return;
    }

    if (!this.loginEmail.includes('@')) {
      this.error = 'Email invalide';
      console.log('Email invalide');
      return;
    }

    if (this.loginPassword.length < 3) {
      this.error = 'Le mot de passe doit contenir au moins 3 caractères';
      console.log('Password trop court');
      return;
    }

    console.log('Validations passées, email:', this.loginEmail, 'password:', this.loginPassword);
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      const result = this.authService.login(this.loginEmail, this.loginPassword);
      console.log('Auth result:', result);

      if (result) {
        console.log('Login successful, navigating to home');
        this.router.navigate(['/user/home']);
      } else {
        this.error = 'Erreur de connexion';
        console.log('Login failed');
      }
      this.loading = false;
    }, 500);
  }

  register() {
    this.error = '';

    // Validation
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

    // Simulate API call
    setTimeout(() => {
      const success = this.authService.register(this.registerName, this.registerEmail, this.registerPassword);

      if (success) {
        alert('Compte créé avec succès! Vous êtes connecté.');
        this.router.navigate(['/user/home']);
      } else {
        this.error = 'Erreur lors de la création du compte';
      }
      this.loading = false;
    }, 500);
  }

  adminLogin() {
    console.log('Admin login called');
    this.errorAdmin = '';

    // Validation
    if (!this.adminEmail || !this.adminPassword) {
      this.errorAdmin = 'Veuillez remplir tous les champs';
      console.log('Admin email ou password vide');
      return;
    }

    if (!this.adminEmail.includes('@')) {
      this.errorAdmin = 'Email invalide';
      console.log('Admin email invalide');
      return;
    }

    console.log('Admin validation passed, email:', this.adminEmail);
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      // Check admin credentials
      if (this.adminEmail === 'admin@deliverwholesale.com' && this.adminPassword === 'admin123') {
        console.log('Admin login successful');
        localStorage.setItem('adminToken', 'token123');
        localStorage.setItem('adminEmail', this.adminEmail);
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorAdmin = 'Email ou mot de passe admin incorrect';
        console.log('Admin login failed');
      }
      this.loading = false;
    }, 500);
  }
}
