import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateAchatLotDto } from '../models/create-achat-lot.dto';

@Injectable({
  providedIn: 'root'
})
export class AchatLotService {

  private api = `${environment.apiEndpoint}/AchatLot`;

  constructor(private http: HttpClient) {}

  // CREATE ACHAT
  createAchat(dto: CreateAchatLotDto): Observable<any> {
    return this.http.post(this.api, dto);
  }

  // GET ALL
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  // GET BY ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // DELETE
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}