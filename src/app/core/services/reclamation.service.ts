import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../../user.products';

export interface CreateReclamationDto {
  sujet: string;
  description: string;
  ordreId?: number;
}

export interface TraiterReclamationDto {
  status: string;
  reponseAdmin: string;
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly http = inject(HttpClient);

  createReclamation(dto: CreateReclamationDto): Observable<Reclamation> {
    return this.http.post<Reclamation>('/api/reclamation', dto);
  }

  getMyReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>('/api/reclamation/mes-reclamations');
  }

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>('/api/reclamation');
  }

  processReclamation(id: number, dto: TraiterReclamationDto): Observable<Reclamation> {
    return this.http.put<Reclamation>(`/api/reclamation/${id}/traiter`, dto);
  }

  deleteReclamation(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/reclamation/${id}`);
  }
}
