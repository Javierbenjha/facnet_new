import {
  ChangeDetectionStrategy, Component, computed, effect, inject, signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AppModal } from '../../shared/app-modal/app-modal';

export interface UnitMeasure {
  id_unidad:   string;
  descripcion: string;
  siglas:      string;
}

const INITIAL_UNITS: UnitMeasure[] = [
  { id_unidad: 'U001', descripcion: 'Unidades',   siglas: 'UND' },
  { id_unidad: 'U002', descripcion: 'Kilogramos', siglas: 'KG'  },
  { id_unidad: 'U003', descripcion: 'Litros',     siglas: 'LT'  },
  { id_unidad: 'U004', descripcion: 'Cajas',      siglas: 'BX'  },
  { id_unidad: 'U005', descripcion: 'Metros',     siglas: 'M'   },
  { id_unidad: 'U006', descripcion: 'Paquetes',   siglas: 'PK'  },
];

@Component({
  selector: 'app-unit-measures',
  templateUrl: './unit-measures.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, Button, InputText, IconField, InputIcon, AppModal],
})
export class UnitMeasures {
  private readonly fb = inject(FormBuilder);

  readonly query       = signal('');
  readonly editing     = signal<UnitMeasure | 'new' | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize    = 10;

  readonly unitMeasures = signal<UnitMeasure[]>(INITIAL_UNITS);

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    return this.unitMeasures().filter(u =>
      !q || u.descripcion.toLowerCase().includes(q) || u.siglas.toLowerCase().includes(q)
    );
  });

  readonly totalItems = computed(() => this.filtered().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize)));
  readonly paginated  = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });
  readonly pageRange  = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly visible    = computed(() => this.editing() !== null);
  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nueva unidad de medida' : `Editar · ${(e as UnitMeasure).descripcion}`;
  });

  readonly form = this.fb.nonNullable.group({
    descripcion: ['', Validators.required],
    siglas:      ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({ descripcion: '', siglas: '' });
      } else {
        const u = e as UnitMeasure;
        this.form.reset({ descripcion: u.descripcion, siglas: u.siglas });
      }
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { descripcion, siglas } = this.form.getRawValue();
    const e = this.editing();
    if (e === 'new') {
      const newId = `U${String(this.unitMeasures().length + 1).padStart(3, '0')}`;
      this.unitMeasures.update(list => [...list, { id_unidad: newId, descripcion, siglas: siglas.toUpperCase() }]);
    } else if (e) {
      this.unitMeasures.update(list =>
        list.map(u => u.id_unidad === (e as UnitMeasure).id_unidad
          ? { ...u, descripcion, siglas: siglas.toUpperCase() }
          : u
        )
      );
    }
    this.editing.set(null);
  }

  delete(id: string) {
    this.unitMeasures.update(list => list.filter(u => u.id_unidad !== id));
    if ((this.editing() as UnitMeasure)?.id_unidad === id) this.editing.set(null);
  }

  close() { this.editing.set(null); }

  goPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) this.currentPage.set(p);
  }

  onQueryChange(v: string) {
    this.query.set(v);
    this.currentPage.set(1);
  }
}
