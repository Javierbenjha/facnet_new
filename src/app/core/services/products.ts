import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product, ProductListParams, ProductListResponse } from '../models/product.model';

@Service()
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  getAll(params: ProductListParams = {}) {
    const p: Record<string, string> = {};
    if (params.page)        p['page']        = String(params.page);
    if (params.limit)       p['limit']       = String(params.limit);
    if (params.search)      p['search']      = params.search;
    if (params.marcaId)     p['marcaId']     = params.marcaId;
    if (params.categoriaId) p['categoriaId'] = params.categoriaId;
    return this.http.get<ProductListResponse>(this.base, { params: p });
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  create(fd: FormData) {
    return this.http.post<Product>(this.base, fd);
  }

  update(id: string, fd: FormData) {
    return this.http.patch<Product>(`${this.base}/${id}`, fd);
  }

  updateStockMin(id: string, stockMin: number) {
    return this.http.patch<{ message: string; stockMin: number }>(
      `${this.base}/${id}/stock-min`,
      { stock_min: stockMin },
    );
  }

  toggleEstado(id: string) {
    return this.http.delete<{ message: string; producto: Product }>(`${this.base}/${id}`);
  }
}
