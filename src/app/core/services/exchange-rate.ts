import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExchangeRateResponse {
  paralelo: number | string;
}

export interface IgvRateResponse {
  igv: { porcentaje: number };
}

@Service()
export class ExchangeRate {
  private readonly http = inject(HttpClient);

  getByDate(fecha: string): Observable<ExchangeRateResponse> {
    return this.http.get<ExchangeRateResponse>(`${environment.apiUrl}/exchange-rate/${fecha}`);
  }

  getIgvByDate(fecha: string): Observable<IgvRateResponse> {
    return this.http.get<IgvRateResponse>(`${environment.apiUrl}/igv/${fecha}`);
  }
}
