import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreateDriverPayload,
  Driver,
  UpdateDriverPayload,
} from '../models/driver.model';

@Service()
export class DriversService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/drivers`;

  // Returns both active (estado 1) and inactive (estado 2) drivers.
  findAll() {
    return this.http.get<Driver[]>(this.base);
  }

  findOne(id: number) {
    return this.http.get<Driver>(`${this.base}/${id}`);
  }

  create(payload: CreateDriverPayload) {
    return this.http.post<Driver>(this.base, payload);
  }

  update(id: number, payload: UpdateDriverPayload) {
    return this.http.patch<Driver>(`${this.base}/${id}`, payload);
  }

  // Toggles estado between active (1) and inactive (2). Returns only a message,
  // and that message always says "eliminado" even on reactivate — don't use it for the toast.
  toggle(id: number) {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
