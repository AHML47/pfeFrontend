import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category } from '../../user.products';

interface BackendCategory {
  id: number;
  nom?: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<BackendCategory[]>('/api/categories').pipe(
      map((cats) => cats.map((c) => ({ id: c.id, name: c.nom ?? c.name ?? '' })))
    );
  }

  createCategory(dto: { name: string }): Observable<Category> {
    return this.http.post<Category>('/api/categories', dto);
  }

  updateCategory(id: number, dto: { name: string }): Observable<void> {
    return this.http.put<void>(`/api/categories/${id}`, dto);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/api/categories/${id}`);
  }
}
