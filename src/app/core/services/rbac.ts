import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Permission,
  RoleDetail,
  RoleListItem,
  SaveRolePayload,
} from '../../pages/roles/roles.model';
import { Observable } from 'rxjs';

@Service()
export class Rbac {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rbac`;

  listRoles(): Observable<RoleListItem[]> {
    return this.http.get<RoleListItem[]>(`${this.apiUrl}/roles`);
  }

  getRole(id: string): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.apiUrl}/roles/${id}`);
  }

  listPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions`);
  }

  create(body: SaveRolePayload): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(`${this.apiUrl}/roles`, body);
  }

  update(id: string, body: Partial<SaveRolePayload>): Observable<RoleDetail> {
    return this.http.put<RoleDetail>(`${this.apiUrl}/roles/${id}`, body);
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/roles/${id}`);
  }
}
