import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const response = this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials);
    return response.pipe(
        tap(res => this._currentUser.set(res.user))
    );
  }
}
