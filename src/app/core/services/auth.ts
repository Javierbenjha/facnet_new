import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  SessionResponse,
  User,
} from '../models/auth.model';
import { CompanySummary } from '../models/company.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _activeCompany = signal<CompanySummary | null>(null);
  private readonly _companies = signal<CompanySummary[]>([]);
  private readonly _permissions = signal<Record<string, string>>({});
  private readonly _sucursalId = signal<string>("");
  readonly currentUser = this._currentUser.asReadonly();
  readonly activeCompany = this._activeCompany.asReadonly();
  readonly companies = this._companies.asReadonly();
  readonly permissions = this._permissions.asReadonly();
  readonly sucursalId = this._sucursalId.asReadonly();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const response = this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials);
    return response.pipe(
      tap((res) => this.setSession({ user: res.user, activeCompany: res.activeCompany, sucursalId: res.sucursalId, companies: res.companies })),
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    const response = this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, data);
    return response.pipe(
      tap((res) => this.setSession({ user: res.user, activeCompany: res.activeCompany })),
    );
  }

  me(): Observable<MeResponse> {
    return this.http
      .get<MeResponse>(`${environment.apiUrl}/auth/me`)
      .pipe(
        tap((res) =>
          this.setSession({
            user: res.user,
            activeCompany: res.activeCompany,
            companies: res.companies,
            permissions: res.permissions,
            sucursalId: res.user.sucursalId
          }),
        ),
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearSession();
      }),
    );
  }

  switchCompany({
    ciaId,
    sucursalId,
  }: {
    ciaId: string;
    sucursalId?: string ;
  }): Observable<SessionResponse> {
    return this.http
      .post<SessionResponse>(`${environment.apiUrl}/auth/switch-company`, { ciaId, sucursalId })
      .pipe(tap((res) => this.setSession({ user: res.user, activeCompany: res.activeCompany, sucursalId: res.sucursalId })));
  }

  clearSession() {
    this._currentUser.set(null);
    this._activeCompany.set(null);
    this._companies.set([]);
    this._permissions.set({});
    this._sucursalId.set("");
  }

  setSession(res: SessionResponse) {
    this._currentUser.set(res.user);
    this._activeCompany.set(res.activeCompany);
    if (res.sucursalId) this._sucursalId.set(res.sucursalId);
    if (res.companies) this._companies.set(res.companies);
    if (res.permissions) this._permissions.set(res.permissions);
  }
}
