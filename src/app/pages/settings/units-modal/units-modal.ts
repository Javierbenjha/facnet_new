import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { UnitService } from '../../../core/services/unit';

interface UnitRow {
  id: string;
  descripcion: string;
  siglas: string;
  deleting: boolean;
}

@Component({
  selector: 'app-units-modal',
  templateUrl: './units-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, Button, InputText],
})
export class UnitsModal {
  visible = model(false);

  private readonly svc   = inject(UnitService);
  private readonly toast = inject(Toaster);

  readonly loading   = signal(false);
  readonly rows      = signal<UnitRow[]>([]);
  readonly adding    = signal(false);
  readonly addBuf    = signal({ descripcion: '', siglas: '' });
  readonly editingId = signal<string | null>(null);
  readonly editBuf   = signal({ descripcion: '', siglas: '' });
  readonly saving    = signal(false);

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        this.cancelAdd();
        this.cancelEdit();
        return this.svc.getAll();
      }),
    ).subscribe({
      next: res => {
        this.rows.set(res.data.map(u => ({
          id:          u.id,
          descripcion: u.descripcion,
          siglas:      u.siglas,
          deleting:    false,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las unidades de medida');
        this.loading.set(false);
      },
    });
  }

  startAdd() {
    this.cancelEdit();
    this.addBuf.set({ descripcion: '', siglas: '' });
    this.adding.set(true);
  }

  cancelAdd() {
    this.adding.set(false);
    this.addBuf.set({ descripcion: '', siglas: '' });
  }

  saveAdd() {
    const { descripcion, siglas } = this.addBuf();
    if (!descripcion.trim() || !siglas.trim()) return;
    this.saving.set(true);
    this.svc.create({ descripcion: descripcion.trim(), siglas: siglas.trim().toUpperCase() }).subscribe({
      next: unit => {
        this.rows.update(list => [{
          id:          unit.id,
          descripcion: unit.descripcion,
          siglas:      unit.siglas,
          deleting:    false,
        }, ...list]);
        this.cancelAdd();
        this.saving.set(false);
        this.toast.success('Unidad creada', unit.descripcion);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', 'No se pudo crear la unidad de medida');
      },
    });
  }

  startEdit(row: UnitRow) {
    this.cancelAdd();
    this.editingId.set(row.id);
    this.editBuf.set({ descripcion: row.descripcion, siglas: row.siglas });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editBuf.set({ descripcion: '', siglas: '' });
  }

  saveEdit(row: UnitRow) {
    const { descripcion, siglas } = this.editBuf();
    const trimDesc   = descripcion.trim();
    const trimSiglas = siglas.trim().toUpperCase();
    if (!trimDesc || !trimSiglas) return;
    if (trimDesc === row.descripcion && trimSiglas === row.siglas) { this.cancelEdit(); return; }
    this.saving.set(true);
    this.svc.update(row.id, { descripcion: trimDesc, siglas: trimSiglas }).subscribe({
      next: unit => {
        this.rows.update(list =>
          list.map(r => r.id === row.id
            ? { ...r, descripcion: unit.descripcion, siglas: unit.siglas }
            : r)
        );
        this.cancelEdit();
        this.saving.set(false);
        this.toast.success('Unidad actualizada', unit.descripcion);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', 'No se pudo actualizar la unidad de medida');
      },
    });
  }

  delete(row: UnitRow) {
    if (row.deleting) return;
    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, deleting: true } : r)
    );
    this.svc.delete(row.id).subscribe({
      next: () => {
        this.rows.update(list => list.filter(r => r.id !== row.id));
        this.toast.success('Unidad eliminada', row.descripcion);
      },
      error: (err) => {
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, deleting: false } : r)
        );
        if (err?.status === 409) {
          this.toast.warning('No se puede eliminar', `"${row.descripcion}" tiene productos asociados`);
        } else {
          this.toast.error('Error', 'No se pudo eliminar la unidad de medida');
        }
      },
    });
  }

  setAddDesc(v: string)   { this.addBuf.update(b => ({ ...b, descripcion: v })); }
  setAddSiglas(v: string) { this.addBuf.update(b => ({ ...b, siglas: v })); }
  setEditDesc(v: string)  { this.editBuf.update(b => ({ ...b, descripcion: v })); }
  setEditSiglas(v: string){ this.editBuf.update(b => ({ ...b, siglas: v })); }
}
