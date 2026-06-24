import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  Cia,
  CiaIGV,
  CiaIGVResponse,
  CiaPassword,
  CiaPasswordResponse,
  CompanyRequest,
  CompanyResponse,
} from '../models/company.model';
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

  getCompanyById(id: string): Observable<Cia> {
    return this.http.get<Cia>(`${this.apiUrl}/${id}`);
  }

  update(body: Partial<CompanyRequest>, ciaId: string): Observable<CompanyResponse> {
    const fd = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      fd.append(key, value instanceof File ? value : String(value));
    });

    return this.http.post<CompanyResponse>(`${this.apiUrl}/${ciaId}`, fd);
  }

  // DELETE = toggle de estado (activa/desactiva), no borra. Devuelve la cía actualizada.
  delete(ciaId: string): Observable<{ message: string; company: Cia }> {
    return this.http.delete<{ message: string; company: Cia }>(`${this.apiUrl}/${ciaId}`);
  }

  getCompanyIgv(): Observable<CiaIGV> {
    return this.http.get<CiaIGV>(`${this.apiUrl}/igv`);
  }
  updateCompanyIgv(): Observable<CiaIGVResponse> {
    return this.http.patch<CiaIGVResponse>(`${this.apiUrl}/igv`, {});
  }

  updatePassword(body: CiaPassword): Observable<CiaPasswordResponse> {
    return this.http.patch<CiaPasswordResponse>(`${this.apiUrl}/password`, body);
  }
}
