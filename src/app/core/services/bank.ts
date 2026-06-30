import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Bank,
  BankListItem,
  CreateBankPayload,
} from '../models/bank.model';

@Service()
export class BankService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/bank`;

  // List: estado / tipo_moneda come as descriptive strings (joins).
  findAll() {
    return this.http.get<BankListItem[]>(this.base);
  }

  // Detail: raw numeric estado / tipo_moneda — needed to preselect the moneda dropdown on edit.
  findOne(id: number) {
    return this.http.get<Bank>(`${this.base}/${id}`);
  }

  create(payload: CreateBankPayload) {
    return this.http.post<Bank>(this.base, payload);
  }

  update(id: number, payload: Partial<CreateBankPayload>) {
    return this.http.patch<Bank>(`${this.base}/${id}`, payload);
  }

  // Toggles estado between active (1) and inactive (2). Returns only a message, no entity.
  toggle(id: number) {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
