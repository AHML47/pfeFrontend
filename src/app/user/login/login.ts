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

  // Login
  loginEmail: string = '';
  loginPassword: string = '';

  // Register
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  registerAddress: string = '';

  // State
  error: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // ================= TOGGLE =================
  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.resetForm();
  }

  // ================= RESET =================
  resetForm() {
    this.error = '';

    this.loginEmail = '';
    this.loginPassword = '';

    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.registerAddress = '';
  }

  // ================= LOGIN =================
  login() {
    this.error = '';

    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Veuillez remplir tous les champs';
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

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;

    this.authService.register(
      this.registerName,
      this.registerEmail,
      this.registerPassword,
      this.registerAddress
    ).subscribe({
      next: (success) => {
        if (success) {
          alert('📩 Email de confirmation envoyé');
this.router.navigate(['/login']);
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
}