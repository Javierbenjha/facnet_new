import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreateReasonPayload,
  CreateReceiptPayload,
  Reason,
  Receipt,
  ReceiptListResponse,
  ReceiptType,
  UpdateReasonPayload,
  UpdateReceiptPayload,
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

  // ── Receipts ─────────────────────────────────────────────────────────────────
  getReceipts(params?: { tipDoc?: 77 | 78; page?: number; limit?: number }) {
    const query: Record<string, string> = {};
    if (params?.tipDoc)  query['tip_doc'] = params.tipDoc.toString();
    if (params?.page)    query['page']    = params.page.toString();
    if (params?.limit)   query['limit']   = params.limit.toString();
    return this.http.get<ReceiptListResponse>(`${this.base}/receipts`, { params: query });
  }

  getReceipt(id: string) {
    return this.http.get<Receipt>(`${this.base}/receipts/${id}`);
  }

  createReceipt(payload: CreateReceiptPayload) {
    return this.http.post<Receipt>(`${this.base}/receipts`, payload);
  }

  updateReceipt(id: string, payload: UpdateReceiptPayload) {
    return this.http.put<Receipt>(`${this.base}/receipts/${id}`, payload);
  }
}
