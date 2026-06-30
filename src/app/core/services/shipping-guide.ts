import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreateShippingGuidePayload,
  ShippingGuide,
  ShippingGuideListFilters,
  ShippingGuideListResponse,
  TransferMotivo,
} from '../models/shipping-guide.model';

@Service()
export class ShippingGuideService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/shipping-guides`;

  getMotivos() {
    return this.http.get<TransferMotivo[]>(`${this.base}/motivos`);
  }

  list(filters: ShippingGuideListFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<ShippingGuideListResponse>(this.base, { params });
  }

  export(filters: Omit<ShippingGuideListFilters, 'page' | 'limit'> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<ShippingGuide[]>(`${this.base}/export`, { params });
  }

  get(serie: string, correlativo: string) {
    return this.http.get<ShippingGuide>(`${this.base}/${serie}/${correlativo}`);
  }

  create(payload: CreateShippingGuidePayload) {
    return this.http.post<ShippingGuide>(this.base, payload);
  }

  cancel(serie: string, correlativo: string) {
    return this.http.patch<ShippingGuide>(`${this.base}/${serie}/${correlativo}/cancel`, {});
  }
}
