import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #f5f5f5;
      font-family: Arial, sans-serif;
    ">
      <h1 style="margin-bottom: 40px; color: #333;">🛒 DeliverWholesale</h1>
      <p style="margin-bottom: 30px; color: #666;">Choisissez votre espace</p>

      <div style="display: flex; gap: 20px;">
        <button (click)="goAdmin()" style="
          padding: 20px 40px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
        ">
          🔐 Espace Admin
        </button>

        <button (click)="goClient()" style="
          padding: 20px 40px;
          background: #2ecc71;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
        ">
          🛍️ Espace Client
        </button>
      </div>
    </div>
  `
})
export class LandingLoginComponent {
  constructor(private router: Router) {}

  goAdmin() {
    this.router.navigate(['/admin/login']);
  }

  goClient() {
    this.router.navigate(['/user/login']);
  }
}