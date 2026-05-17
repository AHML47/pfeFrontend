import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BackendCategory, Category } from '../../user.products';

export interface CategoryDto {
  nom: string;
  description?: string;
  parentId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<BackendCategory[]>('/api/categories').pipe(
      map((cats) => cats.map((c) => this.mapCategory(c)))
    );
  }

  createCategory(dto: CategoryDto | { name: string }): Observable<Category> {
    const payload = this.normalizeDto(dto);
    return this.http
      .post<BackendCategory>('/api/categories', {
        Nom: payload.nom,
        Description: payload.description,
        ParentId: payload.parentId ?? null
      })
      .pipe(map((category) => this.mapCategory(category)));
  }

  updateCategory(id: number, dto: CategoryDto | { name: string }): Observable<void> {
    const payload = this.normalizeDto(dto);
    return this.http.put<void>(`/api/categories/${id}`, {
      Nom: payload.nom,
      Description: payload.description,
      ParentId: payload.parentId ?? null
    });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/api/categories/${id}`);
  }

  private mapCategory(category: BackendCategory): Category {
    return {
      id: category.id ?? category.Id ?? 0,
      name: category.nom ?? category.Nom ?? ''
    };
  }

  private normalizeDto(dto: CategoryDto | { name: string }): CategoryDto {
    if ('name' in dto) {
      return { nom: dto.name };
    }
    return dto;
  }
}
