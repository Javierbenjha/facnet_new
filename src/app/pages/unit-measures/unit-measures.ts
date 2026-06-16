import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AppModal } from '../../shared/app-modal/app-modal';

export interface UnitMeasure {
  id_unidad: string;
  descripcion: string;
  siglas: string;
}

const INITIAL_UNITS: UnitMeasure[] = [
  { id_unidad: 'U001', descripcion: 'Units', siglas: 'UND' },
  { id_unidad: 'U002', descripcion: 'Kilograms', siglas: 'KG' },
  { id_unidad: 'U003', descripcion: 'Liters', siglas: 'LT' },
  { id_unidad: 'U004', descripcion: 'Boxes', siglas: 'BX' },
  { id_unidad: 'U005', descripcion: 'Meters', siglas: 'M' },
  { id_unidad: 'U006', descripcion: 'Packages', siglas: 'PK' },
];

@Component({
  selector: 'app-unit-measures',
  templateUrl: './unit-measures.html',
  styleUrl: './unit-measures.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, AppModal],
})
export class UnitMeasures {
  private readonly fb = inject(FormBuilder);

  // --- State ---
  readonly query = signal('');
  readonly editing = signal<UnitMeasure | 'new' | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = signal(8);

  // --- Data ---
  readonly unitMeasures = signal<UnitMeasure[]>(INITIAL_UNITS);

  // --- Computed ---
  readonly filteredUnitMeasures = computed(() => {
    const q = this.query().toLowerCase().trim();
    return this.unitMeasures().filter(u =>
      !q ||
      u.descripcion.toLowerCase().includes(q) ||
      u.siglas.toLowerCase().includes(q)
    );
  });

  readonly totalItems = computed(() => this.filteredUnitMeasures().length);

  readonly paginatedUnitMeasures = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredUnitMeasures().slice(start, start + this.pageSize());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  );

  readonly showModal = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'New Unit of Measure' : `Edit · ${(e as UnitMeasure).descripcion}`;
  });

  // --- Form ---
  readonly form = this.fb.group({
    descripcion: ['', Validators.required],
    siglas: ['', Validators.required],
  });

  // --- Helpers ---
  showingStart() { return (this.currentPage() - 1) * this.pageSize() + 1; }
  showingEnd() {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  }

  // --- Actions ---
  openNew() {
    this.form.reset({ descripcion: '', siglas: '' });
    this.editing.set('new');
  }

  openEdit(u: UnitMeasure) {
    this.form.reset({ descripcion: u.descripcion, siglas: u.siglas });
    this.editing.set(u);
  }

  closeModal() {
    this.editing.set(null);
  }

  save() {
    if (this.form.invalid) return;

    const formVal = this.form.value;
    const desc = formVal.descripcion || '';
    const sig = formVal.siglas || '';

    const currentEditing = this.editing();
    if (currentEditing === 'new') {
      const newId = `U${String(this.unitMeasures().length + 1).padStart(3, '0')}`;
      const newUnit: UnitMeasure = {
        id_unidad: newId,
        descripcion: desc,
        siglas: sig,
      };
      this.unitMeasures.update(list => [...list, newUnit]);
    } else if (currentEditing) {
      this.unitMeasures.update(list =>
        list.map(u => u.id_unidad === currentEditing.id_unidad
          ? { ...u, descripcion: desc, siglas: sig }
          : u
        )
      );
    }

    this.closeModal();
  }

  delete(id: string) {
    this.unitMeasures.update(list => list.filter(u => u.id_unidad !== id));
    if (this.editing() && (this.editing() as UnitMeasure).id_unidad === id) {
      this.closeModal();
    }
  }

  goPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) this.currentPage.set(p);
  }

  onQueryChange(v: string) {
    this.query.set(v);
    this.currentPage.set(1);
  }
}
