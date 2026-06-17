import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Textarea } from 'primeng/textarea';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { BRANCHES, CATEGORIES, PRODUCTS, Producto } from '../products.models';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, Button, Select, InputText, InputNumber, InputGroup, InputGroupAddon, ToggleSwitch, Textarea, AppModal],
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);

  editing = input<Producto | 'new' | null>(null);
  closed  = output<void>();
  saved   = output<Producto>();

  readonly visible = computed(() => this.editing() !== null);

  readonly editingProduct = computed(() => {
    const e = this.editing();
    return (e && e !== 'new') ? e as Producto : null;
  });

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nuevo producto' : `Editar · ${(e as Producto).descripcion}`;
  });

  readonly categories = CATEGORIES.slice(1).map(c => ({ label: c, value: c }));
  readonly branches   = BRANCHES;

  readonly monedaOptions = [
    { label: 'S/ Soles (PEN)',    value: 'PEN' },
    { label: '$ Dólares (USD)',   value: 'USD' },
  ];

  readonly unitOptions = [
    { label: 'und',  value: 'und'  },
    { label: 'kg',   value: 'kg'   },
    { label: 'lt',   value: 'lt'   },
    { label: 'caja', value: 'caja' },
    { label: 'doc',  value: 'doc'  },
  ];

  readonly igvOptions = [
    { label: '18% (gravado)', value: '18' },
    { label: 'Exonerado',     value: '0'  },
  ];

  readonly form = this.fb.nonNullable.group({
    descripcion:    [''],
    sku:            [''],
    moneda:         ['PEN'],
    categoria:      [''],
    marca:          [''],
    descripcion_larga: [''],
    precio_publico: [0],
    precio_mayor:   [0],
    costo:          [0],
    unidad:         ['und'],
    igv:            ['18'],
    stock_min:      [0],
    es_servicio:    [false],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({
          descripcion: '', sku: '', moneda: 'PEN', categoria: 'Bebidas', marca: '',
          descripcion_larga: '', precio_publico: 0, precio_mayor: 0, costo: 0,
          unidad: 'und', igv: '18', stock_min: 0, es_servicio: false,
        });
      } else {
        const p = e as Producto;
        this.form.patchValue({
          descripcion:       p.descripcion,
          sku:               p.sku,
          moneda:            p.sigla === '$' ? 'USD' : 'PEN',
          categoria:         p.categoria,
          marca:             p.marca,
          descripcion_larga: '',
          precio_publico:    p.precio_publico,
          precio_mayor:      p.precio_mayor,
          costo:             p.costo,
          unidad:            p.unidad,
          igv:               '18',
          stock_min:         p.stock_min,
          es_servicio:       p.st_producto === 0,
        });
      }
    });
  }

  branchStock(p: Producto | null, i: number): number {
    if (!p) return 0;
    return Math.max(0, (p.stock === 999 ? 50 : p.stock) - i * 5);
  }

  generarSku() {
    const cat = this.form.controls.categoria.value;
    const prefix = cat ? cat.substring(0, 3).toUpperCase() : 'PRD';
    const num = Math.floor(Math.random() * 900 + 100);
    this.form.controls.sku.setValue(`${prefix}-${num}`);
  }

  save() {
    const v   = this.form.getRawValue();
    const src = this.editingProduct();
    const producto: Producto = {
      id:             src?.id ?? crypto.randomUUID(),
      sku:            v.sku,
      descripcion:    v.descripcion,
      categoria:      v.categoria,
      marca:          v.marca,
      precio_publico: v.precio_publico,
      precio_mayor:   v.precio_mayor,
      costo:          v.costo,
      unidad:         v.unidad,
      stock:          src?.stock ?? 0,
      stock_min:      v.stock_min,
      estado:         src?.estado ?? 'ACTIVO',
      st_producto:    v.es_servicio ? 0 : 1,
      sigla:          v.moneda === 'USD' ? '$' : 'S/',
    };
    this.saved.emit(producto);
    this.closed.emit();
  }

  close() { this.closed.emit(); }
}
