import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Assignment,
  CreateUserPayload,
  ToggleUserResponse,
  UpdateAssignmentsPayload,
  UpdateUserPayload,
  UserDetail,
  UserListParams,
  UserListResponse,
  UserStats,
} from '../../pages/user-registration/users.model';

@Service()
export class Users {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  list(params: UserListParams = {}): Observable<UserListResponse> {
    const p: Record<string, string> = {};
    if (params.ciaId) p['ciaId'] = params.ciaId;
    if (params.sucursalId) p['sucursalId'] = params.sucursalId;
    if (params.search) p['search'] = params.search;
    if (params.page) p['page'] = String(params.page);
    if (params.limit) p['limit'] = String(params.limit);
    return this.http.get<UserListResponse>(this.apiUrl, { params: p });
  }

  get(id: string): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`);
  }

  // POST /user — multipart/form-data. `assignments` se manda como string JSON.
  create(payload: CreateUserPayload): Observable<UserDetail> {
    const fd = new FormData();
    fd.append('nombre', payload.nombre);
    fd.append('apellido_paterno', payload.apellido_paterno);
    fd.append('apellido_materno', payload.apellido_materno);
    fd.append('email', payload.email);
    fd.append('password', payload.password);
    fd.append('ciaId', payload.ciaId);
    fd.append('assignments', JSON.stringify(payload.assignments));
    if (payload.telefono) fd.append('telefono', payload.telefono);
    if (payload.imagen) fd.append('imagen', payload.imagen);
    return this.http.post<UserDetail>(this.apiUrl, fd);
  }

  // POST /user/:id — multipart/form-data, solo los campos presentes.
  // (No se puede cambiar email ni assignments desde aquí: van por sus propios endpoints.)
  update(id: string, payload: UpdateUserPayload): Observable<UserDetail> {
    const fd = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined && value !== null) fd.append(key, value as string | Blob);
    }
    return this.http.post<UserDetail>(`${this.apiUrl}/${id}`, fd);
  }

  // PUT /user/:id/assignments — JSON normal (sin archivos). Reemplaza el set completo.
  updateAssignments(id: string, payload: UpdateAssignmentsPayload): Observable<Assignment[]> {
    return this.http.put<Assignment[]>(`${this.apiUrl}/${id}/assignments`, payload);
  }

  // DELETE /user/:id — toggle de estado (1 <-> 2), no es delete físico.
  toggleActive(id: string): Observable<ToggleUserResponse> {
    return this.http.delete<ToggleUserResponse>(`${this.apiUrl}/${id}`);
  }

  // GET /user/export/:ciaId — descarga el listado como .xlsx.
  exportExcel(ciaId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${ciaId}`, { responseType: 'blob' });
  }

  // PATCH /user/password-item — clave secundaria del usuario autenticado.
  updatePasswordItem(passwordItem: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/password-item`, {
      password_item: passwordItem,
    });
  }
}
