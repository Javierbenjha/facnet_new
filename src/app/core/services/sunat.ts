import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SunatResponse } from '../models/sunat.model';

@Service()
export class Sunat {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sunat`;

  getByRuc(ruc: string): Observable<SunatResponse> {
    return this.http.get<SunatResponse>(`${this.apiUrl}/${ruc}`);
  }
}
