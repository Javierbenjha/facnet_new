import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Unit, CatalogListResponse } from '../models/product.model';

@Service()
export class UnitService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/unit`;

  getAll(page = 1, limit = 100) {
    return this.http.get<CatalogListResponse<Unit>>(this.base, {
      params: { page: String(page), limit: String(limit) },
    });
  }

  create(payload: { descripcion: string; siglas: string }) {
    return this.http.post<Unit>(this.base, payload);
  }

  update(id: string, payload: Partial<{ descripcion: string; siglas: string }>) {
    return this.http.patch<Unit>(`${this.base}/${id}`, payload);
  }

  // ⚠️ Baja definitiva — falla 409 si hay productos que usan esta unidad
  delete(id: string) {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
