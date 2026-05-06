import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Reclamation,
  CreateReclamationDto,
  TraiterReclamationDto,
} from '../models/reclamation.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReclamationService {

  private readonly baseUrl = environment.apiEndpoint + '/Reclamation';
  private readonly orderUrl = environment.apiEndpoint + '/order'; // 👈 API commandes

  constructor(private http: HttpClient) {}

  // ✅ CREATE RECLAMATION
  create(dto: CreateReclamationDto): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.baseUrl}`, dto);
  }

  // ✅ MES RECLAMATIONS
  getMesReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.baseUrl}/mes-reclamations`);
  }

  // ✅ ORDERS (IMPORTANT FIX)
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.orderUrl);
  }

  // ADMIN
  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.baseUrl);
  }

  traiter(id: number, dto: TraiterReclamationDto): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/${id}/traiter`, dto);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}