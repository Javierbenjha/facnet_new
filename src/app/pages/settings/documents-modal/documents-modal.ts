import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tag } from 'primeng/tag';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { ClientsService } from '../../../core/services/clients';

interface DocRow {
  id: string;
  descripcion: string;
  sigla: string;
  active: boolean;
  toggling: boolean;
}

@Component({
  selector: 'app-documents-modal',
  templateUrl: './documents-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, ToggleSwitch, Tag],
})
export class DocumentsModal {
  visible = model(false);

  private readonly clientsSvc = inject(ClientsService);
  private readonly toast      = inject(Toaster);

  readonly loading = signal(false);
  readonly rows    = signal<DocRow[]>([]);

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        return this.clientsSvc.getAllDocumentTypes();
      }),
    ).subscribe({
      next: types => {
        this.rows.set(
          types.map(d => ({
            id:          d.id_documento,
            descripcion: d.descripcion,
            sigla:       d.sigla,
            active:      d.st === 1,
            toggling:    false,
          }))
        );
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar los documentos');
        this.loading.set(false);
      },
    });
  }

  toggle(row: DocRow) {
    if (row.toggling) return;

    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, toggling: true } : r)
    );

    this.clientsSvc.toggleDocumentType(row.id).subscribe({
      next: res => {
        const nextActive = res.document_type.st === 1;
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, active: nextActive, toggling: false } : r)
        );
        this.toast.success('Estado actualizado', res.message);
      },
      error: () => {
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, toggling: false } : r)
        );
        this.toast.error('Error', 'No se pudo actualizar el estado');
      },
    });
  }
}
