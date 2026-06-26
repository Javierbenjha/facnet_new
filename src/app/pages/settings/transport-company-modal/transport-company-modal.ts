import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { TransportCompanyService } from '../../../core/services/transport-company';
import { TransportCompany } from '../../../core/models/transport-company.model';

interface TransportRow {
  id: number;
  ruc: string;
  razon_social: string;
  direccion: string;
  nro_reg_mtc: string;
  deleting: boolean;
}

interface FormBuffer {
  ruc: string;
  razon_social: string;
  direccion: string;
  nro_reg_mtc: string;
}

const EMPTY_FORM: FormBuffer = { ruc: '', razon_social: '', direccion: '', nro_reg_mtc: '' };

// Field constraints enforced by the API (see transport-company.md).
const LIMITS = {
  RUC_LENGTH: 11,
  RAZON_SOCIAL_MAX: 255,
  DIRECCION_MAX: 255,
  NRO_REG_MTC_MAX: 50,
} as const;

function toRow(c: TransportCompany): TransportRow {
  return {
    id:          c.id,
    ruc:         c.ruc,
    razon_social: c.razon_social,
    direccion:   c.direccion,
    nro_reg_mtc: c.nro_reg_mtc,
    deleting:    false,
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

  readonly loading   = signal(false);
  readonly rows      = signal<TransportRow[]>([]);
  readonly showForm  = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly form      = signal<FormBuffer>({ ...EMPTY_FORM });
  readonly saving    = signal(false);

  readonly rucInvalid = computed(() => {
    const v = this.form().ruc.trim();
    return v.length > 0 && !/^\d{11}$/.test(v);
  });

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        this.cancelForm();
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

  startCreate() {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.showForm.set(true);
  }

  startEdit(row: TransportRow) {
    this.editingId.set(row.id);
    this.form.set({
      ruc:          row.ruc,
      razon_social: row.razon_social,
      direccion:    row.direccion,
      nro_reg_mtc:  row.nro_reg_mtc,
    });
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
  }

  setRuc(v: string)     { this.form.update(f => ({ ...f, ruc: v })); }
  setRazon(v: string)   { this.form.update(f => ({ ...f, razon_social: v })); }
  setDireccion(v: string) { this.form.update(f => ({ ...f, direccion: v })); }
  setMtc(v: string)     { this.form.update(f => ({ ...f, nro_reg_mtc: v })); }

  save() {
    const f = this.form();
    const payload = {
      ruc:          f.ruc.trim(),
      razon_social: f.razon_social.trim(),
      direccion:    f.direccion.trim(),
      nro_reg_mtc:  f.nro_reg_mtc.trim(),
    };

    if (!payload.ruc || !payload.razon_social || !payload.direccion || !payload.nro_reg_mtc) {
      this.toast.warning('Campos incompletos', 'Completá todos los campos obligatorios');
      return;
    }
    if (!/^\d{11}$/.test(payload.ruc)) {
      this.toast.warning('RUC inválido', `El RUC debe tener exactamente ${LIMITS.RUC_LENGTH} dígitos`);
      return;
    }
    if (payload.razon_social.length > LIMITS.RAZON_SOCIAL_MAX ||
        payload.direccion.length > LIMITS.DIRECCION_MAX ||
        payload.nro_reg_mtc.length > LIMITS.NRO_REG_MTC_MAX) {
      this.toast.warning('Texto demasiado largo', 'Revisá los límites de los campos');
      return;
    }

    this.saving.set(true);
    const id = this.editingId();
    const request$ = id === null
      ? this.svc.create(payload)
      : this.svc.update(id, payload);

    request$.subscribe({
      next: company => {
        if (id === null) {
          this.rows.update(list => [toRow(company), ...list]);
          this.toast.success('Empresa creada', company.razon_social);
        } else {
          this.rows.update(list =>
            list.map(r => r.id === id ? toRow(company) : r)
          );
          this.toast.success('Empresa actualizada', company.razon_social);
        }
        this.cancelForm();
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', id === null
          ? 'No se pudo crear la empresa de transporte'
          : 'No se pudo actualizar la empresa de transporte');
      },
    });
  }
}
