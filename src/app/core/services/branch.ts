import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Sucursal, SucursalRequest } from '../models/branch.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class Branch {
  private readonly http = inject(HttpClient);

  create(body: SucursalRequest, ciaId: string): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${environment.apiUrl}/cia/${ciaId}/sucursales`, body);
  }

  getBranches(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${environment.apiUrl}/cia/my-sucursaless`);
  }
}
