import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReniecResponse } from '../models/reniec.model';

@Service()
export class Reniec {
  private readonly http   = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reniec`;

  getByDni(dni: string): Observable<ReniecResponse> {
    return this.http.get<ReniecResponse>(`${this.apiUrl}/${dni}`);
  }
}
