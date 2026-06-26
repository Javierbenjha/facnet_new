import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { TablePagination } from '../../../shared/table-pagination/table-pagination';
import { Toaster } from '../../../core/services/toast';
import { BrandService } from '../../../core/services/brand';

interface CatalogRow {
  id: string;
  descripcion: string;
  active: boolean;
  toggling: boolean;
}

@Component({
  selector: 'app-brands-modal',
  templateUrl: './brands-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, ToggleSwitch, Button, InputText, TablePagination],
})
export class BrandsModal {
  visible = model(false);

  private readonly svc   = inject(BrandService);
  private readonly toast = inject(Toaster);

  private readonly PAGE_SIZE = 5;

  readonly loading     = signal(false);
  readonly rows        = signal<CatalogRow[]>([]);
  readonly query       = signal('');
  readonly currentPage = signal(1);
  readonly adding      = signal(false);
  readonly addBuf      = signal('');
  readonly editingId   = signal<string | null>(null);
  readonly editBuf     = signal('');
  readonly saving      = signal(false);

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    return q ? this.rows().filter(r => r.descripcion.toLowerCase().includes(q)) : this.rows();
  });

  readonly paged = computed(() => {
    const start = (this.currentPage() - 1) * this.PAGE_SIZE;
    return this.filtered().slice(start, start + this.PAGE_SIZE);
  });

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.rows.set([]);
        this.query.set('');
        this.currentPage.set(1);
        this.cancelAdd();
        this.cancelEdit();
        return this.svc.getAll();
      }),
    ).subscribe({
      next: res => {
        this.rows.set(res.data.map(b => ({
          id:          b.id,
          descripcion: b.descripcion,
          active:      b.estado === 1,
          toggling:    false,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las marcas');
        this.loading.set(false);
      },
    });
  }

  startAdd() {
    this.cancelEdit();
    this.addBuf.set('');
    this.adding.set(true);
  }

  cancelAdd() {
    this.adding.set(false);
    this.addBuf.set('');
  }

  saveAdd() {
    const desc = this.addBuf().trim();
    if (!desc) return;
    this.saving.set(true);
    this.svc.create(desc).subscribe({
      next: brand => {
        this.rows.update(list => [{
          id:          brand.id,
          descripcion: brand.descripcion,
          active:      brand.estado === 1,
          toggling:    false,
        }, ...list]);
        this.cancelAdd();
        this.saving.set(false);
        this.toast.success('Marca creada', brand.descripcion);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', 'No se pudo crear la marca');
      },
    });
  }

  startEdit(row: CatalogRow) {
    this.cancelAdd();
    this.editingId.set(row.id);
    this.editBuf.set(row.descripcion);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editBuf.set('');
  }

  saveEdit(row: CatalogRow) {
    const desc = this.editBuf().trim();
    if (!desc || desc === row.descripcion) { this.cancelEdit(); return; }
    this.saving.set(true);
    this.svc.update(row.id, desc).subscribe({
      next: brand => {
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, descripcion: brand.descripcion } : r)
        );
        this.cancelEdit();
        this.saving.set(false);
        this.toast.success('Marca actualizada', brand.descripcion);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', 'No se pudo actualizar la marca');
      },
    });
  }

  onQueryChange(v: string) {
    this.query.set(v);
    this.currentPage.set(1);
  }

  toggle(row: CatalogRow) {
    if (row.toggling) return;
    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, toggling: true } : r)
    );
    this.svc.toggle(row.id).subscribe({
      next: res => {
        this.rows.update(list =>
          list.map(r => r.id === row.id
            ? { ...r, active: res.marca.estado === 1, toggling: false }
            : r)
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
