import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { BankService } from '../../../core/services/bank';
import { BankListItem } from '../../../core/models/bank.model';

interface BankRow {
  id_banco: number;
  descripcion: string;
  nrocuenta: string;
  tipo_moneda: string;   // descriptive string from the list join
  active: boolean;
  toggling: boolean;
}

function toRow(b: BankListItem): BankRow {
  return {
    id_banco:    b.id_banco,
    descripcion: b.descripcion,
    nrocuenta:   b.nrocuenta,
    tipo_moneda: b.tipo_moneda,
    // List returns estado as a string ("Activo" / "Inactivo").
    active:      b.estado.toLowerCase() === 'activo',
    toggling:    false,
  };
}

@Component({
  selector: 'app-banks-modal',
  templateUrl: './banks-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, Tag, Button, InputText],
})
export class BanksModal {
  visible = model(false);

  private readonly svc   = inject(BankService);
  private readonly toast = inject(Toaster);

  readonly loading = signal(false);
  readonly rows    = signal<BankRow[]>([]);

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
        this.toast.error('Error', 'No se pudieron cargar las cuentas bancarias');
        this.loading.set(false);
      },
    });
  }
}
