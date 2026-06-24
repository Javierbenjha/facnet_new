import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Brand, CatalogListResponse } from '../models/product.model';

@Service()
export class BrandService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/brand`;

  getAll(page = 1, limit = 100) {
    return this.http.get<CatalogListResponse<Brand>>(this.base, {
      params: { page: String(page), limit: String(limit) },
    });
  }

  create(descripcion: string) {
    return this.http.post<Brand>(this.base, { descripcion });
  }

  update(id: string, descripcion: string) {
    return this.http.patch<Brand>(`${this.base}/${id}`, { descripcion });
  }

  toggle(id: string) {
    return this.http.delete<{ message: string; marca: Brand }>(`${this.base}/${id}`);
  }
}
