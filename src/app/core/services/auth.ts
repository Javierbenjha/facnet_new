import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import {
  ActiveCompany,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  SessionResponse,
  User,
} from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _activeCompany = signal<ActiveCompany | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly activeCompany = this._activeCompany.asReadonly();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const response = this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials);
    return response.pipe(
      tap((res) => this.setSession({ user: res.user, activeCompany: res.activeCompany })),
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
      .pipe(tap((res) => this._currentUser.set(res.user)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearSession();
      }),
    );
  }

  clearSession() {
    this._currentUser.set(null);
    this._activeCompany.set(null);
  }

  setSession(res: SessionResponse) {
    this._currentUser.set(res.user);
    this._activeCompany.set(res.activeCompany);
  }
}
