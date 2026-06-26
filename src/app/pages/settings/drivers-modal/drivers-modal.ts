import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { DriversService } from '../../../core/services/drivers';
import { ClientsService } from '../../../core/services/clients';
import { Driver } from '../../../core/models/driver.model';
import { DocumentType } from '../../../core/models/client.model';

interface DriverRow {
  id: number;
  tipo_documento: number;
  numero_documento: string;
  licencia: string;
  nombreCompleto: string;
  active: boolean;
  toggling: boolean;
}

function toRow(d: Driver): DriverRow {
  return {
    id:               d.id,
    tipo_documento:   d.tipo_documento,
    numero_documento: d.numero_documento,
    licencia:         d.licencia,
    nombreCompleto:   `${d.nombre} ${d.apellido_paterno} ${d.apellido_materno}`.trim(),
    active:           d.estado === 1,
    toggling:         false,
  };
}

@Component({
  selector: 'app-drivers-modal',
  templateUrl: './drivers-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, Tag, Button, InputText],
})
export class DriversModal {
  visible = model(false);

  private readonly svc        = inject(DriversService);
  private readonly clientsSvc = inject(ClientsService);
  private readonly toast      = inject(Toaster);

  readonly loading  = signal(false);
  readonly rows     = signal<DriverRow[]>([]);
  readonly docTypes = signal<DocumentType[]>([]);

  // Map id_documento (string) -> sigla, to resolve the numeric tipo_documento for display.
  readonly docSiglaById = computed(() =>
    new Map(this.docTypes().map(d => [Number(d.id_documento), d.sigla]))
  );

  private docTypesLoaded = false;

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        this.loadDocTypes();
        return this.svc.findAll();
      }),
    ).subscribe({
      next: list => {
        this.rows.set(list.map(toRow));
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar los conductores');
        this.loading.set(false);
      },
    });
  }

  // Document types feed both the list label and the create/edit dropdown.
  private loadDocTypes() {
    if (this.docTypesLoaded) return;
    this.docTypesLoaded = true;
    this.clientsSvc.getDocumentTypes().subscribe({
      next: types => this.docTypes.set(types),
      error: () => {
        this.docTypesLoaded = false; // allow retry on next open
        this.toast.error('Error', 'No se pudieron cargar los tipos de documento');
      },
    });
  }

  docSigla(tipoDocumento: number): string {
    return this.docSiglaById().get(tipoDocumento) ?? '—';
  }
}
