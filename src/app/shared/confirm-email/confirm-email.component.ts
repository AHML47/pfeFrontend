import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-email.component.html'
})
export class ConfirmEmailComponent implements OnInit {

  message = 'Vérification en cours...';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.message = 'Lien invalide ❌';
      return;
    }

    this.auth.confirmEmail(email, token).subscribe({
      next: () => {
        this.message = 'Compte confirmé ✔';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.message = 'Lien expiré ou invalide ❌';
      }
    });
  }
}