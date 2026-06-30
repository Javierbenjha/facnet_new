import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AddCollectionPayload,
  CreateSalePayload,
  CreateSaleResponse,
  Sale,
  SaleCollection,
  SaleDocType,
  SaleListFilters,
  SaleListResponse,
  SalePaymentMethod,
} from '../models/sale.model';

@Service()
export class SaleService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/sales`;

  getDocTypes() {
    return this.http.get<SaleDocType[]>(`${this.base}/doc-types`);
  }

  getPaymentMethods() {
    return this.http.get<SalePaymentMethod[]>(`${this.base}/payment-methods`);
  }

  list(filters: SaleListFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<SaleListResponse>(this.base, { params });
  }

  export(filters: Omit<SaleListFilters, 'page' | 'limit'> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<Sale[]>(`${this.base}/export`, { params });
  }

  get(tipDoc: number, serie: string, correlativo: string) {
    return this.http.get<Sale>(`${this.base}/${tipDoc}/${serie}/${correlativo}`);
  }

  create(payload: CreateSalePayload) {
    return this.http.post<CreateSaleResponse>(this.base, payload);
  }

  cancel(tipDoc: number, serie: string, correlativo: string) {
    return this.http.patch<Sale>(`${this.base}/${tipDoc}/${serie}/${correlativo}/cancel`, {});
  }

  getCollections(tipDoc: number, serie: string, correlativo: string) {
    return this.http.get<SaleCollection[]>(
      `${this.base}/${tipDoc}/${serie}/${correlativo}/collections`
    );
  }

  addCollection(tipDoc: number, serie: string, correlativo: string, payload: AddCollectionPayload) {
    return this.http.post<SaleCollection>(
      `${this.base}/${tipDoc}/${serie}/${correlativo}/collections`,
      payload
    );
  }

  removeCollection(tipDoc: number, serie: string, correlativo: string, collectionId: string) {
    return this.http.delete<{ message: string; saldo: string }>(
      `${this.base}/${tipDoc}/${serie}/${correlativo}/collections/${collectionId}`
    );
  }

  pdfUrl(tipDoc: number, serie: string, correlativo: string) {
    return `${this.base}/${tipDoc}/${serie}/${correlativo}/pdf`;
  }
}
