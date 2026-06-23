import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SerieResponse } from '../models/stores.model';

@Service()
export class StoresService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/stores`;
  private readonly cache = new Map<string, string>();

  getSerie(tipDoc: number, ref?: string) {
    const key = ref ? `${tipDoc}|${ref}` : `${tipDoc}`;
    const cached = this.cache.get(key);
    if (cached) return of({ serie: cached });

    const params: Record<string, string> = { tipDoc: tipDoc.toString() };
    if (ref) params['ref'] = ref;

    return this.http.get<SerieResponse>(`${this.base}/series`, { params }).pipe(
      tap(res => this.cache.set(key, res.serie))
    );
  }

  clearCache() {
    this.cache.clear();
  }
}
