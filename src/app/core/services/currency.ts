import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ActiveCurrencyEntry,
  CurrencyEntry,
  ToggleCurrencyResponse,
} from '../models/currency.model';

@Service()
export class CurrencyService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/currency`;

  // All currencies configured for the active company.
  findAll() {
    return this.http.get<CurrencyEntry[]>(this.base);
  }

  // Only active currencies (st=1) — used to populate moneda selectors (e.g. bank form).
  findActive() {
    return this.http.get<ActiveCurrencyEntry[]>(`${this.base}/st_currency`);
  }

  // Toggles st between active (1) and inactive (0). No body. POST (create) not implemented yet.
  toggleActive(id: string) {
    return this.http.patch<ToggleCurrencyResponse>(`${this.base}/${id}`, {});
  }
}
