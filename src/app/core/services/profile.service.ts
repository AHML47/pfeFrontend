import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/profile');
  }

  updateProfile(
    nom: string,
    prenom: string,
    email: string,
    adresse?: string
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>('/api/profile', { nom, prenom, email, adresse });
  }

  changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>('/api/profile/change-password', {
      oldPassword,
      newPassword
    });
  }

  updateDeliveryAddress(adresseLivraisonActive: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>('/api/profile/update-delivery-address', {
      adresseLivraisonActive
    });
  }
}
