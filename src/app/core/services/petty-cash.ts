import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreateReasonPayload,
  Reason,
  ReceiptType,
  UpdateReasonPayload,
} from '../models/petty-cash.model';

@Service()
export class PettyCashService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/petty-cash`;

  getReceiptTypes() {
    return this.http.get<ReceiptType[]>(`${this.base}/receipt-types`);
  }

  getReasons(tipoRecibo?: 77 | 78) {
    const params: Record<string, string> = {};
    if (tipoRecibo) params['tipo_recibo'] = tipoRecibo.toString();
    return this.http.get<Reason[]>(`${this.base}/reasons`, { params });
  }

  createReason(payload: CreateReasonPayload) {
    return this.http.post<Reason>(`${this.base}/reasons`, payload);
  }

  updateReason(id: string, payload: UpdateReasonPayload) {
    return this.http.put<Reason>(`${this.base}/reasons/${id}`, payload);
  }

  toggleReason(id: string) {
    return this.http.delete<{ message: string; motivo: Reason }>(`${this.base}/reasons/${id}`);
  }
}
