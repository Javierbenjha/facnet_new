import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
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

interface FormBuffer {
  tipo_documento: number | null;
  numero_documento: string;
  licencia: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

const EMPTY_FORM: FormBuffer = {
  tipo_documento: null,
  numero_documento: '',
  licencia: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
};

// Field constraints enforced by the API (see drivers.md).
const LIMITS = {
  NUMERO_DOC_MAX: 15,
  LICENCIA_MAX: 15,
  NOMBRE_MAX: 100,
} as const;

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
  imports: [FormsModule, AppModal, TableModule, ToggleSwitch, Button, InputText, Select],
})
export class DriversModal {
  visible = model(false);

  private readonly svc        = inject(DriversService);
  private readonly clientsSvc = inject(ClientsService);
  private readonly toast      = inject(Toaster);

  readonly loading   = signal(false);
  readonly rows      = signal<DriverRow[]>([]);
  readonly docTypes  = signal<DocumentType[]>([]);
  readonly showForm  = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly form      = signal<FormBuffer>({ ...EMPTY_FORM });
  readonly saving    = signal(false);

  // Map id_documento (string) -> sigla, to resolve the numeric tipo_documento for display.
  readonly docSiglaById = computed(() =>
    new Map(this.docTypes().map(d => [Number(d.id_documento), d.sigla]))
  );

  // Options for the create/edit dropdown.
  readonly docOptions = computed(() =>
    this.docTypes().map(d => ({ label: `${d.sigla} — ${d.descripcion}`, value: Number(d.id_documento) }))
  );

  private docTypesLoaded = false;

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        this.cancelForm();
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

  startCreate() {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.showForm.set(true);
  }

  startEdit(row: DriverRow) {
    // The row only has the concatenated name; fetch detail for the separate fields.
    this.editingId.set(row.id);
    this.svc.findOne(row.id).subscribe({
      next: d => {
        this.form.set({
          tipo_documento:   d.tipo_documento,
          numero_documento: d.numero_documento,
          licencia:         d.licencia,
          nombre:           d.nombre,
          apellido_paterno: d.apellido_paterno,
          apellido_materno: d.apellido_materno,
        });
        this.showForm.set(true);
      },
      error: () => {
        this.editingId.set(null);
        this.toast.error('Error', 'No se pudo cargar el conductor');
      },
    });
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
  }

  setTipoDoc(v: number)      { this.form.update(f => ({ ...f, tipo_documento: v })); }
  setNumeroDoc(v: string)    { this.form.update(f => ({ ...f, numero_documento: v })); }
  setLicencia(v: string)     { this.form.update(f => ({ ...f, licencia: v })); }
  setNombre(v: string)       { this.form.update(f => ({ ...f, nombre: v })); }
  setApPaterno(v: string)    { this.form.update(f => ({ ...f, apellido_paterno: v })); }
  setApMaterno(v: string)    { this.form.update(f => ({ ...f, apellido_materno: v })); }

  save() {
    const f = this.form();
    const numero_documento = f.numero_documento.trim();
    const licencia         = f.licencia.trim();
    const nombre           = f.nombre.trim();
    const apellido_paterno = f.apellido_paterno.trim();
    const apellido_materno = f.apellido_materno.trim();
    const tipo_documento   = f.tipo_documento;

    if (tipo_documento == null || !numero_documento || !licencia ||
        !nombre || !apellido_paterno || !apellido_materno) {
      this.toast.warning('Campos incompletos', 'Completá todos los campos obligatorios');
      return;
    }
    if (numero_documento.length > LIMITS.NUMERO_DOC_MAX || licencia.length > LIMITS.LICENCIA_MAX) {
      this.toast.warning('Texto demasiado largo', `Documento y licencia: máx ${LIMITS.NUMERO_DOC_MAX} caracteres`);
      return;
    }
    if (nombre.length > LIMITS.NOMBRE_MAX ||
        apellido_paterno.length > LIMITS.NOMBRE_MAX ||
        apellido_materno.length > LIMITS.NOMBRE_MAX) {
      this.toast.warning('Texto demasiado largo', `Nombres: máx ${LIMITS.NOMBRE_MAX} caracteres`);
      return;
    }

    this.saving.set(true);
    const id = this.editingId();
    const payload = { tipo_documento, numero_documento, licencia, nombre, apellido_paterno, apellido_materno };
    const request$ = id === null
      ? this.svc.create(payload)
      : this.svc.update(id, payload);

    request$.subscribe({
      next: driver => {
        const row = toRow(driver);
        if (id === null) {
          this.rows.update(list => [row, ...list]);
          this.toast.success('Conductor creado', row.nombreCompleto);
        } else {
          this.rows.update(list => list.map(r => r.id === id ? row : r));
          this.toast.success('Conductor actualizado', row.nombreCompleto);
        }
        this.cancelForm();
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', id === null
          ? 'No se pudo crear el conductor'
          : 'No se pudo actualizar el conductor');
      },
    });
  }

  toggle(row: DriverRow) {
    if (row.toggling) return;
    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, toggling: true } : r)
    );
    this.svc.toggle(row.id).subscribe({
      // DELETE returns no entity and its message always says "eliminado" even on
      // reactivate — so flip locally and build our own message from the new state.
      next: () => {
        const nextActive = !row.active;
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, active: nextActive, toggling: false } : r)
        );
        this.toast.success(
          nextActive ? 'Conductor activado' : 'Conductor desactivado',
          row.nombreCompleto,
        );
      },
      error: () => {
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, toggling: false } : r)
        );
        this.toast.error('Error', 'No se pudo actualizar el estado del conductor');
      },
    });
  }
}
