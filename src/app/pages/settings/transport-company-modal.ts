import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AppModal } from '../../shared/app-modal/app-modal';
import { Toaster } from '../../core/services/toast';
import { TransportCompanyService } from '../../core/services/transport-company';
import { TransportCompany } from '../../core/models/transport-company.model';

interface TransportRow {
  id: number;
  ruc: string;
  razon_social: string;
  direccion: string;
  nro_reg_mtc: string;
  removing: boolean;
}

function toRow(c: TransportCompany): TransportRow {
  return {
    id:          c.id,
    ruc:         c.ruc,
    razon_social: c.razon_social,
    direccion:   c.direccion,
    nro_reg_mtc: c.nro_reg_mtc,
    removing:    false,
  };
}

@Component({
  selector: 'app-transport-company-modal',
  templateUrl: './transport-company-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, Button, InputText],
})
export class TransportCompanyModal {
  visible = model(false);

  private readonly svc   = inject(TransportCompanyService);
  private readonly toast = inject(Toaster);

  readonly loading = signal(false);
  readonly rows    = signal<TransportRow[]>([]);

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        return this.svc.findAll();
      }),
    ).subscribe({
      next: list => {
        this.rows.set(list.map(toRow));
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las empresas de transporte');
        this.loading.set(false);
      },
    });
  }
}
