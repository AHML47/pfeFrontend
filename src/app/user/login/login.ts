import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

declare const gsap: any;

@Component({
  selector: 'app-user-login',
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  @ViewChild('submitBtn') submitBtn!: ElementRef<HTMLButtonElement>;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  login(): void {
    if (!this.email || !this.password) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const target = this.auth.isAdmin() ? '/admin' : '/';
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.errorMessage = 'Email ou mot de passe incorrect.';
        this.isLoading = false;
      }
    });
  }

  onBtnMove(event: MouseEvent): void {
    const btn = this.submitBtn?.nativeElement;
    if (!btn || typeof gsap === 'undefined') return;
    const r = btn.getBoundingClientRect();
    gsap.to(btn, {
      x: (event.clientX - (r.left + r.width / 2)) * 0.18,
      y: (event.clientY - (r.top + r.height / 2)) * 0.25,
      duration: 0.2
    });
  }

  resetBtn(): void {
    const btn = this.submitBtn?.nativeElement;
    if (!btn || typeof gsap === 'undefined') return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1, 0.35)' });
  }
}
