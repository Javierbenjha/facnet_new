import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ClientSupplier,
  ClientAddress,
  CreateClientPayload,
  UpdateClientPayload,
  CreateClientAddressPayload,
  UpdateClientAddressPayload,
  ExpressClientPayload,
  ClientStats,
  DocumentType,
  DocumentTypeWithStatus,
  ToggleDocumentTypeResponse,
  ClientListResponse,
} from '../models/client.model';

@Service()
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clients`;

  findAll(params?: { tipo_persona?: number; search?: string; page?: number; limit?: number }): Observable<ClientListResponse> {
    return this.http.get<ClientListResponse>(this.base, { params: params as Record<string, string | number> });
  }

  expressCreate(payload: ExpressClientPayload): Observable<ClientSupplier> {
    return this.http.post<ClientSupplier>(`${this.base}/express`, payload);
  }

  getStats(params?: { tipo_persona?: number }): Observable<ClientStats> {
    return this.http.get<ClientStats>(`${this.base}/stats`, { params: params as Record<string, number> });
  }

  getDocumentTypes(): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(`${this.base}/document-types`);
  }

  getAllDocumentTypes(): Observable<DocumentTypeWithStatus[]> {
    return this.http.get<DocumentTypeWithStatus[]>(`${this.base}/document-types/all`);
  }

  toggleDocumentType(documentoId: string): Observable<ToggleDocumentTypeResponse> {
    return this.http.patch<ToggleDocumentTypeResponse>(
      `${this.base}/document-types/${documentoId}/toggle`,
      {},
    );
  }

  exportToExcel(params?: { tipo_persona?: number }): Observable<Blob> {
    return this.http.get(`${this.base}/export`, { params: params as Record<string, number>, responseType: 'blob' });
  }

  searchForSale(tipDoc: 1 | 2, search?: string): Observable<ClientSupplier[]> {
    return this.http.get<ClientSupplier[]>(`${this.base}/sale-search`, {
      params: { tip_doc: String(tipDoc), ...(search ? { search } : {}) },
    });
  }

  searchForBuy(search?: string): Observable<ClientSupplier[]> {
    return this.http.get<ClientSupplier[]>(`${this.base}/buy-search`, {
      params: search ? { search } : {},
    });
  }

  findOne(numeroDocumento: string): Observable<ClientSupplier> {
    return this.http.get<ClientSupplier>(`${this.base}/${numeroDocumento}`);
  }

  create(payload: CreateClientPayload): Observable<ClientSupplier> {
    return this.http.post<ClientSupplier>(this.base, payload);
  }

  update(numeroDocumento: string, payload: UpdateClientPayload): Observable<ClientSupplier> {
    return this.http.patch<ClientSupplier>(`${this.base}/${numeroDocumento}`, payload);
  }

  remove(numeroDocumento: string): Observable<{ message: string; cliente: ClientSupplier }> {
    return this.http.delete<{ message: string; cliente: ClientSupplier }>(`${this.base}/${numeroDocumento}`);
  }

  findAllAddresses(numeroDocumento: string, includeInactive = false): Observable<ClientAddress[]> {
    return this.http.get<ClientAddress[]>(`${this.base}/${numeroDocumento}/addresses`, {
      params: { includeInactive: String(includeInactive) },
    });
  }

  createAddress(numeroDocumento: string, payload: CreateClientAddressPayload): Observable<ClientAddress> {
    return this.http.post<ClientAddress>(`${this.base}/${numeroDocumento}/addresses`, payload);
  }

  updateAddress(
    numeroDocumento: string,
    addressId: string,
    payload: UpdateClientAddressPayload,
  ): Observable<ClientAddress> {
    return this.http.patch<ClientAddress>(
      `${this.base}/${numeroDocumento}/addresses/${addressId}`,
      payload,
    );
  }

  removeAddress(
    numeroDocumento: string,
    addressId: string,
  ): Observable<{ message: string; direccion: ClientAddress }> {
    return this.http.delete<{ message: string; direccion: ClientAddress }>(
      `${this.base}/${numeroDocumento}/addresses/${addressId}`,
    );
  }

  setPrimaryAddress(numeroDocumento: string, addressId: string): Observable<ClientAddress[]> {
    return this.http.patch<ClientAddress[]>(
      `${this.base}/${numeroDocumento}/addresses/${addressId}/set-primary`,
      {},
    );
  }
}
