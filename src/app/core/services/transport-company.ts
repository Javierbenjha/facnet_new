import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreateTransportCompanyPayload,
  TransportCompany,
} from '../models/transport-company.model';

@Service()
export class TransportCompanyService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/transport-company`;

  // GET returns a plain array (only estado=1), not a paginated wrapper.
  findAll() {
    return this.http.get<TransportCompany[]>(this.base);
  }

  findOne(id: number) {
    return this.http.get<TransportCompany>(`${this.base}/${id}`);
  }

  create(payload: CreateTransportCompanyPayload) {
    return this.http.post<TransportCompany>(this.base, payload);
  }

  update(id: number, payload: Partial<CreateTransportCompanyPayload>) {
    return this.http.patch<TransportCompany>(`${this.base}/${id}`, payload);
  }

  // Toggles estado between active (2) and inactive (1). Returns only a message, no entity.
  toggle(id: number) {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
