import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoComplete } from 'primeng/autocomplete';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { ProductForm } from '../../products/product-form/product-form';
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
    FormsModule, AppModal, ProductForm, Button,
    InputText, InputNumber, Select, DatePickerModule,
    AutoComplete, ToggleSwitch,
  ],
})
export class PurchaseForm {
  readonly editing = input<CompraHistorial | 'new' | null>(null);
  readonly closed  = output<void>();

  readonly tiposDoc   = TIPOS_DOC_COMPRA;
  readonly monedaOpts = MONEDA_OPTS;
  readonly pagoOpts   = FORMA_PAGO_OPTS;

  // ── Form state ─────────────────────────────────────────────────────────────
  readonly proveedores          = signal([...PROVEEDORES_MOCK]);
  readonly proveedorSeleccionado = signal(PROVEEDORES_MOCK[0]);
  readonly proveedorFilterText  = signal('');
  readonly showProductForm      = signal(false);
  readonly tipoDoc       = signal<TipoDocCompraOption>(TIPOS_DOC_COMPRA[0]);
  readonly correlativo   = signal('');
  readonly fechaCompra   = signal<Date>(new Date());
  readonly fechaVenc     = signal<Date>(new Date());
  readonly moneda        = signal<'PEN' | 'USD'>('PEN');
  readonly formaPago     = signal<'CONTADO' | 'CREDITO'>('CONTADO');
  readonly igvIncluido      = signal(false);
  readonly descuentoPct     = signal(0);
  readonly productoSuggestions = signal<PosProducto[]>([]);
  selectedProducto: PosProducto | null = null;
  readonly items            = signal<PurchaseItem[]>([]);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() =>
    this.editing() === 'new' ? 'Nueva Compra' : 'Editar Compra'
  );

  readonly sigla = computed(() => this.moneda() === 'PEN' ? 'S/' : '$');

  readonly serie = computed(() => {
    const td = this.tipoDoc();
    if (!td.requiresSerie) return 'AUTO';
    return td.sigla === 'F' ? 'F001' : td.sigla === 'B' ? 'B001' : `${td.sigla}01`;
  });

  readonly bruto = computed(() =>
    this.items().reduce((s, i) => s + i.cantidad * i.precio, 0)
  );

  readonly subtotal = computed(() =>
    this.igvIncluido() ? this.bruto() / 1.18 : this.bruto()
  );

  readonly igvMonto = computed(() => this.subtotal() * 0.18);

  readonly descuentoMonto = computed(() =>
    this.subtotal() * (this.descuentoPct() / 100)
  );

  readonly total = computed(() =>
    this.subtotal() + this.igvMonto() - this.descuentoMonto()
  );

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.proveedorSeleccionado.set(PROVEEDORES_MOCK[0]);
        this.tipoDoc.set(TIPOS_DOC_COMPRA[0]);
        this.correlativo.set('');
        this.fechaCompra.set(new Date());
        this.fechaVenc.set(new Date());
        this.moneda.set('PEN');
        this.formaPago.set('CONTADO');
        this.igvIncluido.set(false);
        this.descuentoPct.set(0);
        this.selectedProducto = null;
        this.productoSuggestions.set([]);
        this.items.set([]);
      } else {
        const td = TIPOS_DOC_COMPRA.find(t => t.value === e.tip_doc) ?? TIPOS_DOC_COMPRA[0];
        this.tipoDoc.set(td);
        this.correlativo.set(e.correlativo);
        this.fechaCompra.set(new Date(e.fecha_compra + 'T00:00:00'));
        this.fechaVenc.set(new Date(e.fecha_vencimiento + 'T00:00:00'));
        this.moneda.set(e.moneda);
        this.formaPago.set(e.forma_pago);
        this.items.set(
          (e.detalles ?? []).map((d, i) => ({
            id: String(i),
            nombre: d.producto_nombre,
            sku: '',
            unidad: 'und',
            cantidad: d.cantidad,
            precio: d.precio_venta,
          }))
        );
      }
    });
  }

  // ── Methods ────────────────────────────────────────────────────────────────
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

  onProductSaved(p: { id: string; descripcion: string; sku: string; unidad: string; precio_costo: number }) {
    this.items.update(list => [...list, {
      id:      p.id,
      nombre:  p.descripcion,
      sku:     p.sku,
      unidad:  p.unidad,
      cantidad: 1,
      precio:  p.precio_costo,
    }]);
    this.showProductForm.set(false);
    this.selectedProducto = null;
    this.productoSuggestions.set([]);
  }

  onProveedorFilter(e: { filter: string }) {
    this.proveedorFilterText.set(e.filter ?? '');
  }

  addProveedor() {
    const nombre = this.proveedorFilterText().trim();
    if (!nombre) return;
    const nuevo = { label: nombre, value: '00000000' };
    this.proveedores.update(list => [...list, nuevo]);
    this.proveedorSeleccionado.set(nuevo);
    this.proveedorFilterText.set('');
  }

  procesar() {
    this.closed.emit();
  }

  close() { this.closed.emit(); }

  fmt(n: number) { return this.sigla() + ' ' + n.toFixed(2); }
}
