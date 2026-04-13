import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
  name: string;
   address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUser$.asObservable();
  private registeredUsers: Map<string, { email: string; password: string; name: string }> = new Map();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Vérifier si un utilisateur est stocké dans localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser$.next(JSON.parse(storedUser));
      }

      // Charger les utilisateurs enregistrés
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        users.forEach((user: any) => {
          this.registeredUsers.set(user.email, user);
        });
      }
    }
  }

  login(email: string, password: string): boolean {
    // Vérifier dans les utilisateurs enregistrés
    const registeredUser = this.registeredUsers.get(email);
    if (registeredUser && registeredUser.password === password) {
      const user: User = {
        id: email,
        email: email,
        name: registeredUser.name
      };
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.currentUser$.next(user);
      return true;
    }

    // Fallback: simple validation (pour les comptes test)
    if (email && password && password.length >= 3) {
      const user: User = {
        id: email,
        email: email,
        name: email.split('@')[0]
      };
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.currentUser$.next(user);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    // Vérifier si l'email existe déjà
    if (this.registeredUsers.has(email)) {
      return false; // Email déjà utilisé
    }

    // Enregistrer le nouvel utilisateur
    this.registeredUsers.set(email, { email, password, name });
    this.saveRegisteredUsers();

    // Connecter automatiquement l'utilisateur après l'inscription
    const user: User = {
      id: email,
      email: email,
      name: name
    };
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUser$.next(user);

    return true;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUser$.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser$.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser$.value;
  }

  private saveRegisteredUsers(): void {
    if (this.isBrowser) {
      const users = Array.from(this.registeredUsers.values());
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
  }
}
