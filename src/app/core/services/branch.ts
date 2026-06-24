import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Sucursal, SucursalRequest } from '../models/branch.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class Branch {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cia`;

  create(body: SucursalRequest): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.apiUrl}/branches`, body);
  }

  getBranches(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.apiUrl}/my-branches`);
  }

  getAllBranches(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.apiUrl}/all-branches`);
  }
}
