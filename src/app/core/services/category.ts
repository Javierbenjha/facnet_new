import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Category, CatalogListResponse } from '../models/product.model';

@Service()
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/category`;

  getAll(page = 1, limit = 100) {
    return this.http.get<CatalogListResponse<Category>>(this.base, {
      params: { page: String(page), limit: String(limit) },
    });
  }

  create(descripcion: string) {
    return this.http.post<Category>(this.base, { descripcion });
  }

  update(id: string, descripcion: string) {
    return this.http.patch<Category>(`${this.base}/${id}`, { descripcion });
  }

  toggle(id: string) {
    return this.http.delete<{ message: string; categoria: Category }>(`${this.base}/${id}`);
  }
}
