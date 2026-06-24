import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoComplete } from 'primeng/autocomplete';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { ProductForm } from '../../products/product-form/product-form';
import { Product } from '../../../core/models/product.model';
import { POS_PRODUCTOS, PosProducto } from '../../sale/sale.models';
import {
  CompraHistorial, PurchaseItem, TIPOS_DOC_COMPRA, TipoDocCompraOption,
} from '../purchase-list.models';

const PROVEEDORES_MOCK = [
  { label: 'ALICORP S.A.A.',                    value: '20100055237' },
  { label: 'COCA-COLA FEMSA PERÚ S.A.',          value: '20100113610' },
  { label: 'NESTLÉ PERÚ S.A.',                   value: '20100116392' },
  { label: 'IMPORTADORA DEL PACÍFICO E.I.R.L.',  value: '20387654321' },
  { label: 'P&G DISTRIBUIDORA PERÚ S.A.C.',      value: '20521879748' },
  { label: 'DISTRIBUIDORA LA MERCED E.I.R.L.',   value: '20456123789' },
  { label: 'CLIENTES OTROS',                     value: '00000000'    },
];

const MONEDA_OPTS = [
  { label: 'Soles (S/)',   value: 'PEN' },
  { label: 'Dólares ($)', value: 'USD' },
];

const FORMA_PAGO_OPTS = [
  { label: 'Contado', value: 'CONTADO' },
  { label: 'Crédito', value: 'CREDITO' },
];

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, ReactiveFormsModule,
    AppModal, ProductForm, Button,
    InputText, InputNumber, Select, DatePickerModule,
    AutoComplete, ToggleSwitch,
  ],
})
export class PurchaseForm {
  private readonly fb = inject(FormBuilder);

  readonly editing = input<CompraHistorial | 'new' | null>(null);
  readonly closed  = output<void>();

  readonly tiposDoc   = TIPOS_DOC_COMPRA;
  readonly monedaOpts = MONEDA_OPTS;
  readonly pagoOpts   = FORMA_PAGO_OPTS;

  // ── Reactive form ──────────────────────────────────────────────────────────
  readonly form = this.fb.nonNullable.group({
    proveedor:   [PROVEEDORES_MOCK[0]],
    tipoDoc:     [TIPOS_DOC_COMPRA[0] as TipoDocCompraOption],
    correlativo: [''],
    formaPago:   ['CONTADO'],
    fechaCompra: [new Date()],
    fechaVenc:   [new Date()],
    moneda:      ['PEN' as 'PEN' | 'USD'],
    igvIncluido: [false],
    descuentoPct:[0],
  });

  // Signals derivados del form — para computed y template reactivo (OnPush)
  readonly tipoDocVal     = toSignal(this.form.controls.tipoDoc.valueChanges,     { initialValue: TIPOS_DOC_COMPRA[0] as TipoDocCompraOption });
  readonly monedaVal      = toSignal(this.form.controls.moneda.valueChanges,      { initialValue: 'PEN' as 'PEN' | 'USD' });
  readonly igvIncluidoVal = toSignal(this.form.controls.igvIncluido.valueChanges, { initialValue: false });
  readonly descuentoPctVal= toSignal(this.form.controls.descuentoPct.valueChanges,{ initialValue: 0 });

  // ── Estado no-form ─────────────────────────────────────────────────────────
  readonly proveedores         = signal([...PROVEEDORES_MOCK]);
  readonly proveedorFilterText = signal('');
  readonly showProductForm     = signal(false);
  readonly productoSuggestions = signal<PosProducto[]>([]);
  readonly items               = signal<PurchaseItem[]>([]);
  selectedProducto: PosProducto | null = null;

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() =>
    this.editing() === 'new' ? 'Nueva Compra' : 'Editar Compra'
  );

  readonly sigla = computed(() => this.monedaVal() === 'PEN' ? 'S/' : '$');

  readonly serie = computed(() => {
    const td = this.tipoDocVal();
    if (!td.requiresSerie) return 'AUTO';
    return td.sigla === 'F' ? 'F001' : td.sigla === 'B' ? 'B001' : `${td.sigla}01`;
  });

  readonly bruto = computed(() =>
    this.items().reduce((s, i) => s + i.cantidad * i.precio, 0)
  );

  readonly subtotal = computed(() =>
    this.igvIncluidoVal() ? this.bruto() / 1.18 : this.bruto()
  );

  readonly igvMonto = computed(() => this.subtotal() * 0.18);

  readonly descuentoMonto = computed(() =>
    this.subtotal() * (this.descuentoPctVal() / 100)
  );

  readonly total = computed(() =>
    this.subtotal() + this.igvMonto() - this.descuentoMonto()
  );

  constructor() {
    // Habilitar/deshabilitar correlativo según tipo de documento
    effect(() => {
      if (this.tipoDocVal()?.requiresSerie) {
        this.form.controls.correlativo.enable();
      } else {
        this.form.controls.correlativo.disable();
      }
    });

    // Patch/reset al abrir el modal
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({
          proveedor:   PROVEEDORES_MOCK[0],
          tipoDoc:     TIPOS_DOC_COMPRA[0],
          correlativo: '',
          formaPago:   'CONTADO',
          fechaCompra: new Date(),
          fechaVenc:   new Date(),
          moneda:      'PEN',
          igvIncluido: false,
          descuentoPct: 0,
        });
        this.items.set([]);
        this.selectedProducto = null;
        this.productoSuggestions.set([]);
      } else {
        const td = TIPOS_DOC_COMPRA.find(t => t.value === e.tip_doc) ?? TIPOS_DOC_COMPRA[0];
        this.form.patchValue({
          tipoDoc:     td,
          correlativo: e.correlativo,
          fechaCompra: new Date(e.fecha_compra + 'T00:00:00'),
          fechaVenc:   new Date(e.fecha_vencimiento + 'T00:00:00'),
          moneda:      e.moneda,
          formaPago:   e.forma_pago,
          descuentoPct: 0,
        });
        this.items.set(
          (e.detalles ?? []).map((d, i) => ({
            id:       String(i),
            nombre:   d.producto_nombre,
            sku:      '',
            unidad:   'und',
            cantidad: d.cantidad,
            precio:   d.precio_venta,
          }))
        );
      }
    });
  }

  // ── Proveedor ──────────────────────────────────────────────────────────────
  onProveedorFilter(e: { filter: string }) {
    this.proveedorFilterText.set(e.filter ?? '');
  }

  addProveedor() {
    const nombre = this.proveedorFilterText().trim();
    if (!nombre) return;
    const nuevo = { label: nombre, value: '00000000' };
    this.proveedores.update(list => [...list, nuevo]);
    this.form.controls.proveedor.setValue(nuevo);
    this.proveedorFilterText.set('');
  }

  // ── Productos ──────────────────────────────────────────────────────────────
  onProductSearch(event: { query: string }) {
    const q = event.query.toLowerCase().trim();
    const results = q
      ? POS_PRODUCTOS.filter(p =>
          p.descripcion.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        ).slice(0, 8)
      : POS_PRODUCTOS.slice(0, 8);
    this.productoSuggestions.set(results);
  }

  onProductSelect(p: PosProducto) {
    this.items.update(list => {
      const idx = list.findIndex(i => i.id === p.id);
      if (idx >= 0) {
        const updated = [...list];
        updated[idx] = { ...updated[idx], cantidad: updated[idx].cantidad + 1 };
        return updated;
      }
      return [...list, {
        id: p.id, nombre: p.descripcion, sku: p.sku,
        unidad: 'und', cantidad: 1, precio: p.precio_costo,
      }];
    });
    setTimeout(() => { this.selectedProducto = null; });
  }

  onProductSaved(p: Product) {
    this.items.update(list => [...list, {
      id: p.id, nombre: p.descripcion, sku: p.sku,
      unidad: p.unidad ?? '', cantidad: 1, precio: p.costo,
    }]);
    this.showProductForm.set(false);
    this.selectedProducto = null;
    this.productoSuggestions.set([]);
  }

  // ── Tabla ──────────────────────────────────────────────────────────────────
  removeItem(id: string) {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  updateCantidad(id: string, cantidad: number) {
    this.items.update(list => {
      const idx = list.findIndex(i => i.id === id);
      if (idx < 0) return list;
      const updated = [...list];
      updated[idx] = { ...updated[idx], cantidad: Math.max(0.0001, cantidad) };
      return updated;
    });
  }

  updatePrecio(id: string, precio: number) {
    this.items.update(list => {
      const idx = list.findIndex(i => i.id === id);
      if (idx < 0) return list;
      const updated = [...list];
      updated[idx] = { ...updated[idx], precio: Math.max(0, precio) };
      return updated;
    });
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  procesar() { this.closed.emit(); }
  close()    { this.closed.emit(); }

  fmt(n: number) { return this.sigla() + ' ' + n.toFixed(2); }
}
