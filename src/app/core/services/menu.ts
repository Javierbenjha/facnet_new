import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Modulo } from '../models/menu.model';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Service()
export class Menu {
  private readonly http = inject(HttpClient);
  private readonly _modules = signal<Modulo[]>([]);
  readonly module = this._modules.asReadonly();

  load(): Observable<Modulo[]> {
    return this.http
      .get<Modulo[]>(`${environment.apiUrl}/modulos`)
      .pipe(tap((modules) => this._modules.set(modules)));
  }
}
