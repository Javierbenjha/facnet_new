import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { BankService } from '../../../core/services/bank';
import { CurrencyService } from '../../../core/services/currency';
import { Bank, BankListItem } from '../../../core/models/bank.model';

interface BankRow {
  id_banco: number;
  descripcion: string;
  nrocuenta: string;
  tipo_moneda: string;   // descriptive string (list join) or resolved label after create/edit
  active: boolean;
  toggling: boolean;
}

interface MonedaOption {
  label: string;
  value: number;
}

interface FormBuffer {
  descripcion: string;
  nrocuenta: string;
  tipo_moneda: number | null;
}

const EMPTY_FORM: FormBuffer = { descripcion: '', nrocuenta: '', tipo_moneda: null };

// List returns estado as a string ("Activo" / "Inactivo").
function listToRow(b: BankListItem): BankRow {
  return {
    id_banco:    b.id_banco,
    descripcion: b.descripcion,
    nrocuenta:   b.nrocuenta,
    tipo_moneda: b.tipo_moneda,
    active:      b.estado.toLowerCase() === 'activo',
    toggling:    false,
  };
}

@Component({
  selector: 'app-banks-modal',
  templateUrl: './banks-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, Tag, ToggleSwitch, Button, InputText, Select],
})
export class BanksModal {
  visible = model(false);

  private readonly svc         = inject(BankService);
  private readonly currencySvc = inject(CurrencyService);
  private readonly toast       = inject(Toaster);

  readonly loading   = signal(false);
  readonly rows      = signal<BankRow[]>([]);
  readonly monedas   = signal<MonedaOption[]>([]);
  readonly showForm  = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly form      = signal<FormBuffer>({ ...EMPTY_FORM });
  readonly saving    = signal(false);

  private monedasLoaded = false;

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        this.cancelForm();
        this.loadMonedas();
        return this.svc.findAll();
      }),
    ).subscribe({
      next: list => {
        this.rows.set(list.map(listToRow));
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las cuentas bancarias');
        this.loading.set(false);
      },
    });
  }

  // tipo_moneda options come from active currencies (CurrencyService.findActive).
  private loadMonedas() {
    if (this.monedasLoaded) return;
    this.monedasLoaded = true;
    this.currencySvc.findActive().subscribe({
      next: list => this.monedas.set(list.map(c => ({
        label: `${c.descripcion} (${c.sigla})`,
        value: Number(c.id_moneda),
      }))),
      error: () => {
        this.monedasLoaded = false; // allow retry on next open
        this.toast.error('Error', 'No se pudieron cargar las monedas');
      },
    });
  }

  // Create/update return a numeric Bank — resolve the moneda label from the loaded options.
  private bankToRow(b: Bank): BankRow {
    const moneda = this.monedas().find(m => m.value === b.tipo_moneda);
    return {
      id_banco:    b.id_banco,
      descripcion: b.descripcion,
      nrocuenta:   b.nrocuenta,
      tipo_moneda: moneda?.label ?? String(b.tipo_moneda),
      active:      b.estado === 1,
      toggling:    false,
    };
  }

  startCreate() {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.showForm.set(true);
  }

  startEdit(row: BankRow) {
    // The list row only has the moneda string, so fetch detail for the numeric tipo_moneda.
    this.editingId.set(row.id_banco);
    this.svc.findOne(row.id_banco).subscribe({
      next: bank => {
        this.form.set({
          descripcion: bank.descripcion,
          nrocuenta:   bank.nrocuenta,
          tipo_moneda: bank.tipo_moneda,
        });
        this.showForm.set(true);
      },
      error: () => {
        this.editingId.set(null);
        this.toast.error('Error', 'No se pudo cargar la cuenta bancaria');
      },
    });
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
  }

  setDescripcion(v: string)  { this.form.update(f => ({ ...f, descripcion: v })); }
  setNrocuenta(v: string)    { this.form.update(f => ({ ...f, nrocuenta: v })); }
  setTipoMoneda(v: number)   { this.form.update(f => ({ ...f, tipo_moneda: v })); }

  save() {
    const f = this.form();
    const descripcion = f.descripcion.trim();
    const nrocuenta   = f.nrocuenta.trim();
    const tipo_moneda = f.tipo_moneda;

    if (!descripcion || !nrocuenta || tipo_moneda == null) {
      this.toast.warning('Campos incompletos', 'Completá descripción, número de cuenta y moneda');
      return;
    }

    this.saving.set(true);
    const id = this.editingId();
    const payload = { descripcion, nrocuenta, tipo_moneda };
    const request$ = id === null
      ? this.svc.create(payload)
      : this.svc.update(id, payload);

    request$.subscribe({
      next: bank => {
        const row = this.bankToRow(bank);
        if (id === null) {
          this.rows.update(list => [row, ...list]);
          this.toast.success('Cuenta creada', bank.descripcion);
        } else {
          this.rows.update(list => list.map(r => r.id_banco === id ? row : r));
          this.toast.success('Cuenta actualizada', bank.descripcion);
        }
        this.cancelForm();
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', id === null
          ? 'No se pudo crear la cuenta bancaria'
          : 'No se pudo actualizar la cuenta bancaria');
      },
    });
  }

  toggle(row: BankRow) {
    if (row.toggling) return;
    this.rows.update(list =>
      list.map(r => r.id_banco === row.id_banco ? { ...r, toggling: true } : r)
    );
    this.svc.toggle(row.id_banco).subscribe({
      // DELETE returns only a message (no entity), so we flip the state locally.
      next: res => {
        this.rows.update(list =>
          list.map(r => r.id_banco === row.id_banco ? { ...r, active: !r.active, toggling: false } : r)
        );
        this.toast.success('Estado actualizado', res.message);
      },
      error: () => {
        this.rows.update(list =>
          list.map(r => r.id_banco === row.id_banco ? { ...r, toggling: false } : r)
        );
        this.toast.error('Error', 'No se pudo actualizar el estado de la cuenta');
      },
    });
  }
}
