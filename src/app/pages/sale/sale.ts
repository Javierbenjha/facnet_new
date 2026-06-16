import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { Popover } from 'primeng/popover';
import {
  CartItem, DetraccionConcepto, DETRACCION_CONCEPTOS, FormaPago,
  METODOS_PAGO, MetodoPago, Moneda, POS_PRODUCTOS, PosProducto,
  RETENCION_PORCENTAJE, TIPOS_DOC, TipoDoc,
} from './sale.models';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'w-full h-full flex overflow-hidden' },
  imports: [Button, IconField, InputIcon, InputText, InputNumber, Select, DatePickerModule, Popover, FormsModule],
})
export class Sale {
  readonly metodosPago          = METODOS_PAGO;
  readonly tiposDoc             = TIPOS_DOC;
  readonly detraccionConceptos  = DETRACCION_CONCEPTOS;

  // ── Product search / filter ────────────────────────────────────────────────
  readonly query     = signal('');
  readonly catActiva = signal('Todas');

  // ── Sale info fields ───────────────────────────────────────────────────────
  readonly cliente      = signal('');
  readonly tipoDoc      = signal<TipoDoc>('boleta');
  readonly moneda       = signal<Moneda>('PEN');
  readonly formaPago    = signal<FormaPago>('contado');
  readonly descuento    = signal(0);
  readonly fechaEmision = signal<Date>(new Date());

  // ── Detracción / Retención ─────────────────────────────────────────────────
  readonly showDetRet      = signal(false);
  readonly detracConcepto  = signal<DetraccionConcepto | null>(null);
  readonly aplicaRetencion = signal(false);
  readonly retencionPct    = signal(RETENCION_PORCENTAJE);

  // ── Cart ───────────────────────────────────────────────────────────────────
  readonly cart      = signal<CartItem[]>([]);
  readonly ticketNum = signal(1);

  // ── Modal state ────────────────────────────────────────────────────────────
  readonly showPago   = signal(false);
  readonly showTicket = signal(false);
  readonly metodoPago = signal<MetodoPago>('efectivo');
  readonly efectivo   = signal(0);
  readonly lastSale   = signal<{ subtotal: number; descuento: number; igv: number; total: number } | null>(null);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly categorias = computed(() => [
    'Todas',
    ...new Set(POS_PRODUCTOS.map(p => p.categoria)),
  ]);

  readonly filteredProductos = computed(() => {
    const q   = this.query().toLowerCase().trim();
    const cat = this.catActiva();
    return POS_PRODUCTOS.filter(p =>
      (cat === 'Todas' || p.categoria === cat) &&
      (!q || p.descripcion.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    );
  });

  readonly serie = computed(() => {
    const found = TIPOS_DOC.find(t => t.value === this.tipoDoc());
    return found?.serie ?? 'B001';
  });

  readonly sigla = computed(() => this.moneda() === 'PEN' ? 'S/' : '$');

  readonly bruto = computed(() =>
    this.cart().reduce((s, i) => s + i.precio_venta * i.cantidad, 0)
  );
  readonly descuentoMonto = computed(() => this.bruto() * (this.descuento() / 100));
  readonly subtotal       = computed(() => this.bruto() - this.descuentoMonto());
  readonly igv            = computed(() => this.subtotal() * 0.18);
  readonly total          = computed(() => this.subtotal() + this.igv());
  readonly vuelto         = computed(() => Math.max(0, this.efectivo() - this.total()));
  readonly cobrarLabel    = computed(() => 'Cobrar  ' + this.sigla() + ' ' + this.total().toFixed(2));
  readonly fechaLabel     = computed(() => this.fechaEmision().toLocaleDateString('es-PE'));
  readonly detracMonto    = computed(() => this.total() * ((this.detracConcepto()?.porcentaje ?? 0) / 100));
  readonly retencionMonto = computed(() => this.total() * (this.retencionPct() / 100));

  // ── Cart operations ────────────────────────────────────────────────────────
  addToCart(p: PosProducto) {
    this.cart.update(items => {
      const idx = items.findIndex(i => i.producto.id === p.id);
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], cantidad: updated[idx].cantidad + 1 };
        return updated;
      }
      return [...items, { producto: p, cantidad: 1, precio_venta: p.precio_publico }];
    });
  }

  removeFromCart(id: string) {
    this.cart.update(items => items.filter(i => i.producto.id !== id));
  }

  changeQty(id: string, delta: number) {
    this.cart.update(items => {
      const idx = items.findIndex(i => i.producto.id === id);
      if (idx < 0) return items;
      const newQty = items[idx].cantidad + delta;
      if (newQty <= 0) return items.filter(i => i.producto.id !== id);
      const updated = [...items];
      updated[idx] = { ...updated[idx], cantidad: newQty };
      return updated;
    });
  }

  updatePrecio(id: string, precio: number) {
    this.cart.update(items => {
      const idx = items.findIndex(i => i.producto.id === id);
      if (idx < 0) return items;
      const updated = [...items];
      updated[idx] = { ...updated[idx], precio_venta: precio || 0 };
      return updated;
    });
  }

  clearCart() { this.cart.set([]); }

  setDetraccion(concepto: DetraccionConcepto | null) {
    this.detracConcepto.set(concepto);
    if (concepto) this.aplicaRetencion.set(false);
  }

  toggleRetencion() {
    const next = !this.aplicaRetencion();
    this.aplicaRetencion.set(next);
    if (next) this.detracConcepto.set(null);
  }

  // ── Payment flow ───────────────────────────────────────────────────────────
  cobrar() {
    if (!this.cart().length) return;
    this.showPago.set(true);
  }

  confirmarPago() {
    this.lastSale.set({
      subtotal:   this.subtotal(),
      descuento:  this.descuentoMonto(),
      igv:        this.igv(),
      total:      this.total(),
    });
    this.ticketNum.update(n => n + 1);
    this.cart.set([]);
    this.cliente.set('');
    this.descuento.set(0);
    this.efectivo.set(0);
    this.metodoPago.set('efectivo');
    this.showPago.set(false);
    this.showTicket.set(true);
  }

  cerrarTicket() { this.showTicket.set(false); }

  // ── Helpers ────────────────────────────────────────────────────────────────
  fmt(n: number) {
    return this.sigla() + ' ' + n.toFixed(2);
  }

  padTicket(n: number) {
    return '#' + n.toString().padStart(3, '0');
  }
}
