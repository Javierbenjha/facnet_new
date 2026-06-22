import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cia, CompanyRequest, CompanyResponse } from '../models/company.model';
import { environment } from '../../../environments/environment';
import { Auth } from './auth';

@Service()
export class Company {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cia`;
  private readonly auth = inject(Auth);

  create(body: CompanyRequest): Observable<CompanyResponse> {
    const fd = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    fd.append(key, value instanceof File ? value : String(value));
  });
    return this.http
      .post<CompanyResponse>(`${this.apiUrl}`, fd)
      .pipe(tap((res) => this.auth.setSession(res)));
  }

  getCompanies(): Observable<Cia[]> {
    return this.http.get<Cia[]>(`${this.apiUrl}`);
  }
}
