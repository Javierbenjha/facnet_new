import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CompanyDocType, ToggleDocTypeResponse } from '../models/doc-type.model';

@Service()
export class DocTypesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/doc-types`;

  findAll() {
    return this.http.get<CompanyDocType[]>(this.base);
  }

  toggleVentas(tipoDocId: number) {
    return this.http.patch<ToggleDocTypeResponse>(`${this.base}/${tipoDocId}/ventas`, {});
  }

  toggleCompras(tipoDocId: number) {
    return this.http.patch<ToggleDocTypeResponse>(`${this.base}/${tipoDocId}/compras`, {});
  }
}
