import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

/** User authentication screen with animated glass panel and floating label forms. */
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
  toggleMode(): void { this.isRegisterMode = !this.isRegisterMode; this.resetForm(); }
  resetForm(): void { this.error=''; this.loginEmail=''; this.loginPassword=''; this.registerName=''; this.registerEmail=''; this.registerPassword=''; this.registerConfirmPassword=''; this.registerAddress=''; }
  login(): void { if (!this.loginEmail || !this.loginPassword) { this.error='Veuillez remplir tous les champs'; return; } this.loading=true; this.error=''; this.authService.login(this.loginEmail,this.loginPassword).subscribe({next:(r)=>{this.loading=false; r?this.router.navigate(['/user/home']):this.error='Erreur de connexion';}, error:()=>{this.loading=false; this.error='Email ou mot de passe incorrect';}}); }
  register(): void { if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) { this.error='Veuillez remplir tous les champs'; return;} if(this.registerPassword!==this.registerConfirmPassword){this.error='Les mots de passe ne correspondent pas'; return;} this.loading=true; this.authService.register(this.registerName,this.registerEmail,this.registerPassword,this.registerAddress).subscribe({next:(ok)=>{this.loading=false; if(ok){this.isRegisterMode=false; this.error='';}else{this.error='Erreur lors de la création du compte';}}, error:()=>{this.loading=false; this.error='Erreur serveur';}}); }
}
