import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreatePurchasePayload,
  Purchase,
  PurchaseDocType,
  PurchaseListFilters,
  PurchaseListResponse,
  PurchasePaymentMethod,
} from '../models/purchase.model';

@Service()
export class PurchaseService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/purchases`;

  getDocTypes() {
    return this.http.get<PurchaseDocType[]>(`${this.base}/doc-types`);
  }

  getPaymentMethods() {
    return this.http.get<PurchasePaymentMethod[]>(`${this.base}/payment-methods`);
  }

  list(filters: PurchaseListFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<PurchaseListResponse>(this.base, { params });
  }

  export(filters: Omit<PurchaseListFilters, 'page' | 'limit'> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<Purchase[]>(`${this.base}/export`, { params });
  }

  get(serie: string, correlativo: string) {
    return this.http.get<Purchase>(`${this.base}/${serie}/${correlativo}`);
  }

  create(payload: CreatePurchasePayload) {
    return this.http.post<Purchase>(this.base, payload);
  }

  cancel(serie: string, correlativo: string) {
    return this.http.patch<Purchase>(`${this.base}/${serie}/${correlativo}/cancel`, {});
  }
}
