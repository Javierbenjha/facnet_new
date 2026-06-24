import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Sucursal, SucursalRequest, SucursalListItem } from '../models/branch.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class Branch {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cia`;

  create(body: SucursalRequest): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.apiUrl}/branches`, body);
  }

  createByCiaID(body: SucursalRequest, ciaId: string): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.apiUrl}/${ciaId}/branches`, body);
  }

  update(id: string, body: SucursalRequest): Observable<SucursalListItem> {
    return this.http.patch<SucursalListItem>(`${this.apiUrl}/branches/${id}`, body);
  }

  // DELETE real (hard delete) — la sucursal se elimina, no es toggle.
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/branches/${id}`);
  }

  getBranches(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.apiUrl}/my-branches`);
  }

  getAllBranches(): Observable<SucursalListItem[]> {
    return this.http.get<SucursalListItem[]>(`${this.apiUrl}/all-branches`);
  }
}
