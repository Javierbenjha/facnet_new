import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CatalogItem } from '../models/product.model';

@Service()
export class CatalogsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}`;

  getMarcas() {
    return this.http.get<CatalogItem[]>(`${this.base}/marcas`);
  }

  createMarca(payload: { descripcion: string }) {
    return this.http.post<CatalogItem>(`${this.base}/marcas`, payload);
  }

  getCategorias() {
    return this.http.get<CatalogItem[]>(`${this.base}/categorias`);
  }

  createCategoria(payload: { descripcion: string }) {
    return this.http.post<CatalogItem>(`${this.base}/categorias`, payload);
  }

  getUnidades() {
    return this.http.get<CatalogItem[]>(`${this.base}/unidades`);
  }

  createUnidad(payload: { descripcion: string }) {
    return this.http.post<CatalogItem>(`${this.base}/unidades`, payload);
  }
}
