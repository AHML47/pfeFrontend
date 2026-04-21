import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string; 
  user: User;
}

export interface JwtPayload {
  sub: string;       
  email: string;
  name: string;
  iat: number;       
  exp: number;       
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly API_URL = environment.apiEndpoint;

  private currentUser$ = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUser$.asObservable();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Restaurer l'utilisateur depuis le token stocké au démarrage
      const token = this.getAccessToken();
      if (token && !this.isTokenExpired(token)) {
        const user = this.decodeUserFromToken(token);
        this.currentUser$.next(user);
      } else {
        this.clearTokens();
      }
    }
  }

  // ─── AUTH METHODS ──────────────────────────────────────────────

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => this.handleAuthResponse(response)),
      map(() => true)
    );
  }

 register(name: string, email: string, password: string, address: string): Observable<boolean> {
  return this.http.post<AuthResponse>(`${this.API_URL}/register`, {
    name,
    email,
    password,
    address
  }).pipe(
    tap(response => this.handleAuthResponse(response)),
    map(() => true)
  );
}
  logout(): void {
    // Optionnel : notifier le backend pour invalider le refresh token
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refresh_token: refreshToken }).subscribe();
    }

    this.clearTokens();
    this.currentUser$.next(null);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ access_token: string }>(
      `${this.API_URL}/refresh`,
      { refresh_token: refreshToken }
    ).pipe(
      tap(res => this.storeAccessToken(res.access_token)),
      map(res => res.access_token)
    );
  }

  // ─── TOKEN MANAGEMENT ──────────────────────────────────────────

  getAccessToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.ACCESS_TOKEN_KEY) : null;
  }

  getRefreshToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.REFRESH_TOKEN_KEY) : null;
  }

  private storeAccessToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  private clearTokens(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.storeAccessToken(response.access_token);
    if (response.refresh_token && this.isBrowser) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
    }
    this.currentUser$.next(response.user);
  }

  // ─── JWT UTILS ─────────────────────────────────────────────────

  decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private decodeUserFromToken(token: string): User | null {
    const payload = this.decodeToken(token);
    if (!payload) return null;
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name
    };
  }

  // ─── HELPERS ───────────────────────────────────────────────────

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  getCurrentUser(): User | null {
    return this.currentUser$.value;
  }
  
  
}