import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, filter, of, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tag } from 'primeng/tag';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { CurrencyService } from '../../../core/services/currency';
import { CurrencyEntry } from '../../../core/models/currency.model';

interface CurrencyRow {
  id: string;
  descripcion: string;
  sigla: string;
  sigla_sunat: string;
  active: boolean;
  toggling: boolean;
}

function toRow(c: CurrencyEntry): CurrencyRow {
  return {
    id:          c.id,
    descripcion: c.descripcion,
    sigla:       c.sigla,
    sigla_sunat: c.sigla_sunat,
    active:      c.st === 1,
    toggling:    false,
  };
}

@Component({
  selector: 'app-currencies-modal',
  templateUrl: './currencies-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, ToggleSwitch, Tag],
})
export class CurrenciesModal {
  visible = model(false);

  private readonly svc   = inject(CurrencyService);
  private readonly toast = inject(Toaster);

  readonly loading = signal(false);
  readonly rows    = signal<CurrencyRow[]>([]);

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        return this.svc.findAll().pipe(
          // GET /currency returns 400 when the company has no currencies — treat as empty.
          catchError(err => {
            if (err?.status !== 400) {
              this.toast.error('Error', 'No se pudieron cargar las monedas');
            }
            return of([] as CurrencyEntry[]);
          }),
        );
      }),
    ).subscribe(list => {
      this.rows.set(list.map(toRow));
      this.loading.set(false);
    });
  }

  toggle(row: CurrencyRow) {
    if (row.toggling) return;
    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, toggling: true } : r)
    );
    this.svc.toggleActive(row.id).subscribe({
      // Response `data` is partial — only `st` is reliable. `messa` is the (misspelled) message field.
      next: res => {
        const active = res.data.st === 1;
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, active, toggling: false } : r)
        );
        this.toast.success('Estado actualizado', res.messa);
      },
      error: () => {
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, toggling: false } : r)
        );
        this.toast.error('Error', 'No se pudo actualizar el estado de la moneda');
      },
    });
  }
}
