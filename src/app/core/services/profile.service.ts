import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserProfile, UserProfileApi } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfileApi>('/api/profile').pipe(
      map((profile) => ({
        id: String(profile.Id),
        nom: profile.Nom,
        prenom: profile.Prenom,
        email: profile.Email,
        adresse: profile.Adresse,
        role: profile.Role
      }))
    );
  }

  updateProfile(
    nom: string,
    prenom: string,
    email: string,
    adresse?: string
  ): Observable<string> {
    return this.http.put<string>('/api/profile', {
      Nom: nom,
      Prenom: prenom,
      Email: email,
      Adresse: adresse
    });
  }

  changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<string> {
    return this.http.put<string>('/api/profile/change-password', {
      OldPassword: oldPassword,
      NewPassword: newPassword
    });
  }

  updateDeliveryAddress(adresseLivraisonActive: string): Observable<string> {
    return this.http.put<string>('/api/profile/update-delivery-address', {
      AdresseLivraisonActive: adresseLivraisonActive
    });
  }
}
