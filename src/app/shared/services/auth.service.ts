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
  token: string;        // ✅ correspond au backend
  refresh_token?: string;
  role: string;
  email: string;
  fullName: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly ROLE_KEY = 'role';
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
      const token = this.getAccessToken();
      if (token && !this.isTokenExpired(token)) {
        const user = this.decodeUserFromToken(token);
        this.currentUser$.next(user);
      } else {
        this.clearTokens();
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password }).pipe(
      tap(response => this.handleAuthResponse(response)),
      map(() => true)
    );
  }

  register(name: string, email: string, password: string, address: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, {
      fullName: name, email, password, address
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      map(() => true)
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refresh_token: refreshToken }).subscribe();
    }
    this.clearTokens();
    this.currentUser$.next(null);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ token: string }>(
      `${this.API_URL}/refresh`,
      { refresh_token: refreshToken }
    ).pipe(
      tap(res => this.storeAccessToken(res.token)),  // ✅ res.token
      map(res => res.token)                           // ✅ res.token
    );
  }

  getAccessToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.ACCESS_TOKEN_KEY) : null;
  }

  getRefreshToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.REFRESH_TOKEN_KEY) : null;
  }

  getRole(): string | null {
    return this.isBrowser ? localStorage.getItem(this.ROLE_KEY) : null;
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
      localStorage.removeItem(this.ROLE_KEY);
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.storeAccessToken(response.token);  // ✅ était response.access_token
    if (this.isBrowser) {
      localStorage.setItem(this.ROLE_KEY, response.role);
    }
    if (response.refresh_token && this.isBrowser) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
    }
    this.currentUser$.next(response.user);
  }

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

    const id = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
             || payload.sub
             || payload['nameid'];

    const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
                || payload.email;

    return { id, email, name: payload.name || '' };
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  isUser(): boolean {
    return this.getRole()?.toLowerCase() === 'client';
  }

  isAdmin(): boolean {
    return this.getRole()?.toLowerCase() === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUser$.value;
  }

  confirmEmail(email: string, token: string) {
    return this.http.get(
      'http://localhost:5045/api/auth/confirm-email',
      { params: { email, token } }
    );
  }
}