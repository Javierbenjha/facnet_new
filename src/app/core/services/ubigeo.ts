import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Department, District, Province } from '../models/ubigeo.model';

@Service()
export class Ubigeo {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/location/departamentos`;

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getProvinces(department: string): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.apiUrl}/${department}/provincias`);
  }

  getDistricts(department: string, province: string): Observable<District[]> {
    return this.http.get<District[]>(
      `${this.apiUrl}/${department}/provincias/${province}/distritos`,
    );
  }
}
