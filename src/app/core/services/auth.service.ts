import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../user.products';

export type UserRole = 'Admin' | 'Client';

interface SessionUser {
  fullName: string;
  email: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'dw_token';
  private readonly userKey = 'dw_session_user';

  private readonly userSignal = signal<SessionUser | null>(this.readUser());
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'Admin');

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        const user: SessionUser = {
          fullName: res.fullName,
          email: res.email,
          role: res.role === 'Admin' ? 'Admin' : 'Client'
        };
        this.userSignal.set(user);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      })
    );
  }

  register(fullName: string, email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/register', { fullName, email, password });
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}).subscribe();
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSignal.set(null);
  }

  private readUser(): SessionUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }
}
