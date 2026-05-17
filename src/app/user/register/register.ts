import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

declare const gsap: any;

@Component({
  selector: 'app-user-register',
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  @ViewChild('submitBtn') submitBtn!: ElementRef<HTMLButtonElement>;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  register(): void {
    if (!this.fullName || !this.email || !this.password) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.register(this.fullName, this.email, this.password).subscribe({
      next: (res) => {
        this.successMessage = res.message ?? 'Inscription réussie. Veuillez confirmer votre email.';
        this.isLoading = false;
        setTimeout(() => this.router.navigateByUrl('/login'), 2000);
      },
      error: () => {
        this.errorMessage = "L'inscription a échoué. Veuillez réessayer.";
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
