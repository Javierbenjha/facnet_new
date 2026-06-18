import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AutoComplete } from 'primeng/autocomplete';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { NumField } from '../../../shared/num-field/num-field';
import { CATEGORIES, MARCAS, UNIDADES, Producto } from '../products.models';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, Button, Select, InputText, InputGroup, InputGroupAddon, ToggleSwitch, AutoComplete, AppModal, NumField],
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);

  editing = input<Producto | 'new' | null>(null);
  closed  = output<void>();
  saved   = output<Producto>();

  fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

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

  readonly monedaOptions = [
    { label: 'S/ Soles (PEN)', value: 'PEN' },
    { label: '$ Dólares (USD)', value: 'USD' },
  ];

  readonly form = this.fb.nonNullable.group({
    descripcion:    [''],
    sku:            [''],
    moneda:         ['PEN'],
    precio_publico: [0],
    precio_mayor:   [0],
    costo:          [0],
    peso:           [0],
    stock_min:      [0],
    es_servicio:    [false],
    stafecto:       [true],
    stdesc:         [false],
  });

  readonly esServicio = toSignal(
    this.form.controls.es_servicio.valueChanges,
    { initialValue: false }
  );

  // Imagen
  imagePreview = signal<string | null>(null);

  // Autocomplete valores
  marcaValue     = signal('');
  categoriaValue = signal('');
  unidadValue    = signal('');

  // Autocomplete queries (para el botón "Agregar")
  marcaQuery     = signal('');
  categoriaQuery = signal('');
  unidadQuery    = signal('');

  // Sugerencias
  marcaSuggestions     = signal<string[]>([]);
  categoriaSuggestions = signal<string[]>([]);
  unidadSuggestions    = signal<string[]>([]);

  private marcas     = [...MARCAS];
  private categorias = [...CATEGORIES.slice(1)];
  private unidades   = [...UNIDADES];

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;

      const prev = this.imagePreview();
      if (prev) URL.revokeObjectURL(prev);
      this.imagePreview.set(null);

      if (e === 'new') {
        this.form.reset({
          descripcion: '', sku: '', moneda: 'PEN',
          precio_publico: 0, precio_mayor: 0, costo: 0,
          peso: 0, stock_min: 0, es_servicio: false, stafecto: true, stdesc: false,
        });
        this.marcaValue.set('');
        this.categoriaValue.set('');
        this.unidadValue.set('');
      } else {
        const p = e as Producto;
        this.form.patchValue({
          descripcion:    p.descripcion,
          sku:            p.sku,
          moneda:         p.sigla === '$' ? 'USD' : 'PEN',
          precio_publico: p.precio_publico,
          precio_mayor:   p.precio_mayor,
          costo:          p.costo,
          peso:           p.peso ?? 0,
          stock_min:      p.stock_min,
          es_servicio:    p.st_producto === 0,
          stafecto:       (p.stafecto ?? 1) === 1,
          stdesc:         (p.stdesc   ?? 0) === 1,
        });
        this.marcaValue.set(p.marca);
        this.categoriaValue.set(p.categoria);
        this.unidadValue.set(p.unidad);
      }
    });
  }

  // ── Imagen ──────────────────────────────────────────────────────────────────

  triggerFileInput() {
    this.fileInputRef()?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const prev = this.imagePreview();
    if (prev) URL.revokeObjectURL(prev);
    this.imagePreview.set(URL.createObjectURL(file));
  }

  removeImage() {
    const prev = this.imagePreview();
    if (prev) URL.revokeObjectURL(prev);
    this.imagePreview.set(null);
    const input = this.fileInputRef()?.nativeElement;
    if (input) input.value = '';
  }

  // ── Autocomplete ─────────────────────────────────────────────────────────────

  filterMarcas(event: { query: string }) {
    this.marcaQuery.set(event.query);
    const q = event.query.toLowerCase();
    this.marcaSuggestions.set(this.marcas.filter(m => m.toLowerCase().includes(q)));
  }

  filterCategorias(event: { query: string }) {
    this.categoriaQuery.set(event.query);
    const q = event.query.toLowerCase();
    this.categoriaSuggestions.set(this.categorias.filter(c => c.toLowerCase().includes(q)));
  }

  filterUnidades(event: { query: string }) {
    this.unidadQuery.set(event.query);
    const q = event.query.toLowerCase();
    this.unidadSuggestions.set(this.unidades.filter(u => u.toLowerCase().includes(q)));
  }

  addMarca(value: string) {
    if (value && !this.marcas.includes(value)) this.marcas.push(value);
    this.marcaValue.set(value);
  }

  addCategoria(value: string) {
    if (value && !this.categorias.includes(value)) this.categorias.push(value);
    this.categoriaValue.set(value);
  }

  addUnidad(value: string) {
    if (value && !this.unidades.includes(value)) this.unidades.push(value);
    this.unidadValue.set(value);
  }

  // ── SKU ──────────────────────────────────────────────────────────────────────

  generarSku() {
    const cat    = this.categoriaValue();
    const prefix = cat ? cat.substring(0, 3).toUpperCase() : 'PRD';
    const num    = Math.floor(Math.random() * 900 + 100);
    this.form.controls.sku.setValue(`${prefix}-${num}`);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  save() {
    const v   = this.form.getRawValue();
    const src = this.editingProduct();
    const producto: Producto = {
      id:             src?.id ?? crypto.randomUUID(),
      sku:            v.sku,
      descripcion:    v.descripcion,
      categoria:      v.es_servicio ? '' : this.categoriaValue(),
      marca:          v.es_servicio ? '' : this.marcaValue(),
      unidad:         v.es_servicio ? '' : this.unidadValue(),
      peso:           v.es_servicio ? undefined : v.peso,
      stock_min:      v.es_servicio ? 0 : v.stock_min,
      precio_publico: v.precio_publico,
      precio_mayor:   v.precio_mayor,
      costo:          v.costo,
      stock:          src?.stock ?? 0,
      estado:         src?.estado ?? 'ACTIVO',
      st_producto:    v.es_servicio ? 0 : 1,
      stafecto:       v.stafecto ? 1 : 0,
      stdesc:         v.stdesc   ? 1 : 0,
      sigla:          v.moneda === 'USD' ? '$' : 'S/',
    };
    this.saved.emit(producto);
    this.closed.emit();
  }

  close() { this.closed.emit(); }
}
