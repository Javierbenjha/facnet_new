import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CompanyRequest, CompanyResponse } from '../models/company.model';
import { environment } from '../../../environments/environment';
import { Auth } from './auth';

@Service()
export class Company {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/companies`;
  private readonly auth = inject(Auth);


  create(body: CompanyRequest): Observable<CompanyResponse> {
    return this.http.post<CompanyResponse>(`${this.apiUrl}`, body).pipe(
      tap(res => this.auth.setSession(res))
    );
  }
}
