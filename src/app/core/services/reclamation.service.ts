import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Reclamation, ReclamationApi } from '../../user.products';

export interface CreateReclamationDto {
  orderId: number;
  sujet: string;
  description: string;
}

export interface TraiterReclamationDto {
  status: string;
  reponseAdmin: string;
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly http = inject(HttpClient);

  createReclamation(dto: CreateReclamationDto): Observable<Reclamation> {
    return this.http
      .post<ReclamationApi>('/api/reclamation', {
        OrderId: dto.orderId,
        Sujet: dto.sujet,
        Description: dto.description
      })
      .pipe(map((reclamation) => this.mapReclamation(reclamation)));
  }

  getMyReclamations(): Observable<Reclamation[]> {
    return this.http.get<ReclamationApi[]>('/api/reclamation/mes-reclamations').pipe(
      map((items) => items.map((item) => this.mapReclamation(item)))
    );
  }

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<ReclamationApi[]>('/api/reclamation').pipe(
      map((items) => items.map((item) => this.mapReclamation(item)))
    );
  }

  processReclamation(id: number, dto: TraiterReclamationDto): Observable<Reclamation> {
    return this.http
      .put<ReclamationApi>(`/api/reclamation/${id}/traiter`, {
        Status: dto.status,
        ReponseAdmin: dto.reponseAdmin
      })
      .pipe(map((reclamation) => this.mapReclamation(reclamation)));
  }

  deleteReclamation(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message?: string; Message?: string }>(`/api/reclamation/${id}`)
      .pipe(map((res) => ({ message: res.message ?? res.Message ?? '' })));
  }

  private mapReclamation(item: ReclamationApi): Reclamation {
    return {
      id: item.Id ?? 0,
      orderId: item.OrderId,
      userId: item.UserId,
      sujet: item.Sujet,
      description: item.Description,
      status: item.Status,
      reponseAdmin: item.ReponseAdmin,
      dateCreation: item.DateCreation,
      dateResolution: item.DateResolution ?? null,
      resolvedByUserId: item.ResolvedByUserId ?? null,
      clientNom: item.UserId
    };
  }
}
