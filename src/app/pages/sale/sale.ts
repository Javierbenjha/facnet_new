import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { AppModal } from '../../shared/app-modal/app-modal';
import { SaleHeader } from './sale-header/sale-header';
import { SaleInfo } from './sale-info/sale-info';
import { SaleProducts } from './sale-products/sale-products';
import { SaleCart } from './sale-cart/sale-cart';
import {
  CartItem, CartTotals, DetraccionConcepto, DETRACCION_CONCEPTOS, FormaPago,
  METODOS_PAGO, MetodoPago, Moneda, POS_PRODUCTOS, PosProducto,
  RETENCION_PORCENTAJE, SaleInfoSummary, TIPOS_DOC, TipoDoc,
} from './sale.models';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'w-full h-full flex overflow-hidden' },
  imports: [Button, InputNumber, AppModal, FormsModule, SaleHeader, SaleInfo, SaleProducts, SaleCart],
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

  // ── Price warn modal ───────────────────────────────────────────────────────
  readonly showPriceWarn = signal(false);
  readonly priceWarn = signal<{
    type: 'bonificacion' | 'costo' | 'min';
    id: string;
    precio: number;
    previo: number;
    costo: number;
    min: number;
    nombre: string;
  } | null>(null);

  // ── Modal state ────────────────────────────────────────────────────────────
  readonly showPago   = signal(false);
  readonly showTicket = signal(false);
  readonly metodoPago = signal<MetodoPago>('efectivo');
  readonly efectivo   = signal(0);
  readonly lastSale   = signal<{ subtotal: number; inafecto: number; gratuito: number; descuento: number; igv: number; total: number } | null>(null);

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

  readonly brutoGravado  = computed(() =>
    this.cart().filter(i => i.producto.st_afecto === 1 && i.precio_venta > 0)
               .reduce((s, i) => s + i.precio_venta * i.cantidad, 0)
  );
  readonly brutoInafecto = computed(() =>
    this.cart().filter(i => i.producto.st_afecto === 0 && i.precio_venta > 0)
               .reduce((s, i) => s + i.precio_venta * i.cantidad, 0)
  );
  readonly gratuito      = computed(() =>
    this.cart().filter(i => i.precio_venta === 0)
               .reduce((s, i) => s + i.producto.precio_publico * i.cantidad, 0)
  );

  readonly descuentoMonto = computed(() =>
    (this.brutoGravado() + this.brutoInafecto()) * (this.descuento() / 100)
  );
  readonly subtotal = computed(() => this.brutoGravado() * (1 - this.descuento() / 100));
  readonly inafecto = computed(() => this.brutoInafecto() * (1 - this.descuento() / 100));
  readonly igv      = computed(() => this.subtotal() * 0.18);
  readonly total    = computed(() => this.subtotal() + this.igv() + this.inafecto());
  readonly vuelto   = computed(() => Math.max(0, this.efectivo() - this.total()));
  readonly cobrarLabel    = computed(() => 'Cobrar  ' + this.sigla() + ' ' + this.total().toFixed(2));
  readonly fechaLabel     = computed(() => this.fechaEmision().toLocaleDateString('es-PE'));
  readonly priceWarnTitle = computed(() => {
    switch (this.priceWarn()?.type) {
      case 'bonificacion': return 'Confirmar Bonificación';
      case 'costo':        return 'Precio menor al costo';
      case 'min':          return 'Precio menor al mínimo';
      default:             return '';
    }
  });
  readonly detracMonto    = computed(() => this.total() * ((this.detracConcepto()?.porcentaje ?? 0) / 100));
  readonly retencionMonto = computed(() => this.total() * (this.retencionPct() / 100));

  readonly saleInfoSummary = computed((): SaleInfoSummary => ({
    tipoDocLabel: TIPOS_DOC.find(t => t.value === this.tipoDoc())?.label ?? '',
    serie:        this.serie(),
    fechaLabel:   this.fechaLabel(),
    cliente:      this.cliente(),
    moneda:       this.moneda(),
    formaPago:    this.formaPago(),
    descuento:    this.descuento(),
    cartLength:   this.cart().length,
  }));

  readonly cartTotals = computed((): CartTotals => ({
    subtotal:       this.subtotal(),
    brutoGravado:   this.brutoGravado(),
    inafecto:       this.inafecto(),
    igv:            this.igv(),
    total:          this.total(),
    gratuito:       this.gratuito(),
    descuentoMonto: this.descuentoMonto(),
    descuento:      this.descuento(),
  }));

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
    const item = this.cart().find(i => i.producto.id === id);
    if (!item) return;

    const p      = item.producto;
    const previo = item.precio_venta;

    if (precio === 0) {
      this.priceWarn.set({ type: 'bonificacion', id, precio, previo, costo: p.precio_costo, min: p.precio_min, nombre: p.descripcion });
      this.showPriceWarn.set(true);
      return;
    }
    if (precio < p.precio_costo) {
      this.priceWarn.set({ type: 'costo', id, precio, previo, costo: p.precio_costo, min: p.precio_min, nombre: p.descripcion });
      this.showPriceWarn.set(true);
      return;
    }
    if (precio < p.precio_min) {
      this.priceWarn.set({ type: 'min', id, precio, previo, costo: p.precio_costo, min: p.precio_min, nombre: p.descripcion });
      this.showPriceWarn.set(true);
      return;
    }

    this.applyPrecio(id, precio);
  }

  confirmPriceWarn() {
    const w = this.priceWarn();
    if (w) this.applyPrecio(w.id, w.precio);
    this.showPriceWarn.set(false);
    this.priceWarn.set(null);
  }

  cancelPriceWarn() {
    const w = this.priceWarn();
    if (w) this.applyPrecio(w.id, w.previo);
    this.showPriceWarn.set(false);
    this.priceWarn.set(null);
  }

  private applyPrecio(id: string, precio: number) {
    this.cart.update(items => {
      const idx = items.findIndex(i => i.producto.id === id);
      if (idx < 0) return items;
      const updated = [...items];
      updated[idx] = { ...updated[idx], precio_venta: precio };
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
      subtotal:  this.subtotal(),
      inafecto:  this.inafecto(),
      gratuito:  this.gratuito(),
      descuento: this.descuentoMonto(),
      igv:       this.igv(),
      total:     this.total(),
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
