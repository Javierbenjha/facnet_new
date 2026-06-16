import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { BRANCHES, CATEGORIES, Producto } from '../products.models';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, Button, Select, InputText, InputNumber, Textarea, AppModal],
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);

  editing = input<Producto | 'new' | null>(null);
  closed  = output<void>();

  readonly visible = computed(() => this.editing() !== null);

  readonly editingProduct = computed(() => {
    const e = this.editing();
    return (e && e !== 'new') ? e as Producto : null;
  });

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nuevo producto' : `Editar · ${(e as Producto).name}`;
  });

  readonly categories = CATEGORIES.slice(1).map(c => ({ label: c, value: c }));
  readonly branches   = BRANCHES;

  readonly unitOptions = [
    { label: 'und',  value: 'und'  },
    { label: 'kg',   value: 'kg'   },
    { label: 'lt',   value: 'lt'   },
    { label: 'caja', value: 'caja' },
  ];

  readonly igvOptions = [
    { label: '18% (gravado)', value: '18' },
    { label: 'Exonerado',     value: '0'  },
  ];

  readonly form = this.fb.nonNullable.group({
    name:        [''],
    sku:         [''],
    cat:         [''],
    description: [''],
    price:       [0],
    cost:        [0],
    unit:        ['und'],
    igv:         ['18'],
    stockMin:    [30],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({ name: '', sku: '', cat: 'Café', description: '', price: 0, cost: 0, unit: 'und', igv: '18', stockMin: 30 });
      } else {
        this.form.patchValue({ name: e.name, sku: e.sku, cat: e.cat, description: '', price: e.price, cost: e.cost, unit: e.unit, igv: '18', stockMin: 30 });
      }
    });
  }

  branchStock(p: Producto | null, i: number): number {
    if (!p) return 0;
    return Math.max(0, (p.stock === 999 ? 50 : p.stock) - i * 5);
  }

  close() { this.closed.emit(); }
}
