import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of, skip, Subject, debounceTime, EMPTY } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { AppModal } from '../../shared/app-modal/app-modal';
import { ProductForm } from '../products/product-form/product-form';
import { Product } from '../../core/models/product.model';
import { SaleHeader } from './sale-header/sale-header';
import { SaleInfo } from './sale-info/sale-info';
import { SaleProducts } from './sale-products/sale-products';
import { SaleCart } from './sale-cart/sale-cart';
import { NcForm } from './nc-form/nc-form';
import { NdForm } from './nd-form/nd-form';
import { CustomerForm } from '../customers-suppliers/customer-form/customer-form';
import { ClientSupplier } from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients';
import {
  CartItem, CartTotals, DetraccionConcepto, DETRACCION_CONCEPTOS, FormaPago,
  METODOS_PAGO, MetodoPago, Moneda, PosProducto,
  RETENCION_PORCENTAJE, SaleInfoSummary, TIPOS_DOC, TipoDoc,
} from './sale.models';
import { SaleCalculadoraService } from './sale-calculadora.service';
import { ProductsService } from '../../core/services/products';
import { SaleService } from '../../core/services/sale';
import { Company } from '../../core/services/company';
import { Cia } from '../../core/models/company.model';
import { ExchangeRate } from '../../core/services/exchange-rate';
import { Auth } from '../../core/services/auth';
import { Toaster } from '../../core/services/toast';
import { CreateSalePayload, SalePaymentMethod } from '../../core/models/sale.model';

const COLOR_PALETTE = [
  'bg-red-100', 'bg-blue-100', 'bg-emerald-100', 'bg-amber-100',
  'bg-purple-100', 'bg-cyan-100', 'bg-pink-100', 'bg-stone-100',
  'bg-teal-100', 'bg-orange-100',
];

@Component({
  selector: 'app-sale',
  templateUrl: './sale.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'w-full h-full flex overflow-hidden' },
  imports: [Button, InputNumber, AppModal, FormsModule, ProductForm, SaleHeader, SaleInfo, SaleProducts, SaleCart, NcForm, NdForm, CustomerForm],
})
export class Sale {
  private readonly calculadora     = inject(SaleCalculadoraService);
  private readonly productsService = inject(ProductsService);
  private readonly clientsService  = inject(ClientsService);
  private readonly saleService     = inject(SaleService);
  private readonly companySvc      = inject(Company);
  private readonly exchangeRateSvc = inject(ExchangeRate);
  private readonly auth            = inject(Auth);
  private readonly toaster         = inject(Toaster);

  readonly metodosPago          = METODOS_PAGO;
  readonly tiposDoc             = TIPOS_DOC;
  readonly detraccionConceptos  = DETRACCION_CONCEPTOS;

  // ── Product catalog ────────────────────────────────────────────────────────
  readonly productos        = signal<PosProducto[]>([]);
  readonly loadingProductos = signal(true);

  // ── Product form modal ─────────────────────────────────────────────────────
  readonly showProductForm = signal(false);

  // ── Client search ─────────────────────────────────────────────────────────
  readonly showClientForm      = signal(false);
  readonly clienteNumeroDoc    = signal<string | null>(null);
  readonly clienteSuggestions  = signal<ClientSupplier[]>([]);
  private readonly clienteQuery$ = new Subject<string>();

  // ── NC / ND modals ────────────────────────────────────────────────────────
  readonly showNcForm = signal(false);
  readonly showNdForm = signal(false);

  // ── Product search / filter ────────────────────────────────────────────────
  readonly query     = signal('');
  readonly catActiva = signal('Todas');

  // ── Sale info fields ───────────────────────────────────────────────────────
  readonly cliente      = signal('');
  readonly tipoDoc      = signal<TipoDoc>('boleta');
  readonly moneda          = signal<Moneda>('PEN');
  readonly formaPago       = signal<FormaPago>('contado');
  readonly fechaVencimiento = signal<Date | null>(null);
  readonly descuento       = signal(0);
  readonly igvIncluido    = signal(false);
  readonly igvPorcentaje  = signal(18);
  readonly monto700       = signal(700);
  readonly limitRetencion = signal(700);
  readonly tipoCambio     = signal(0);
  readonly fechaEmision   = signal<Date>(new Date());

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
  readonly saving     = signal(false);
  readonly lastSale   = signal<{ subtotal: number; inafecto: number; gratuito: number; descuento: number; igv: number; total: number } | null>(null);

  // ── Payment methods ────────────────────────────────────────────────────────
  private readonly paymentMethods = signal<SalePaymentMethod[]>([]);

  private readonly TIP_DOC_MAP: Record<TipoDoc, number> = {
    boleta: 3, factura: 1, nota_venta: 41,
  };

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly categorias = computed(() => [
    'Todas',
    ...new Set(this.productos().map(p => p.categoria)),
  ]);

  readonly filteredProductos = computed(() => {
    const q   = this.query().toLowerCase().trim();
    const cat = this.catActiva();
    return this.productos().filter(p =>
      (cat === 'Todas' || p.categoria === cat) &&
      (!q || p.descripcion.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    );
  });

  readonly serie = computed(() => {
    const found = TIPOS_DOC.find(t => t.value === this.tipoDoc());
    return found?.serie ?? 'B001';
  });

  readonly sigla = computed(() => this.moneda() === 'PEN' ? 'S/' : '$');

  // ── Totales (delegados al servicio) ───────────────────────────────────────
  private readonly _totales = computed(() =>
    this.calculadora.calcularTotales({
      items:               this.cart().map(i => ({
        cantidad:        i.cantidad,
        precio_venta:    i.precio_venta,
        precio_publico:  i.producto.precio_publico,
        st_afecto:       i.producto.st_afecto,
      })),
      igvPorcentaje:  this.igvPorcentaje(),
      igvIncluido:    this.igvIncluido(),
      descuentoMonto: this.descuento(),
    })
  );

  readonly brutoGravado  = computed(() =>
    this.cart().filter(i => i.producto.st_afecto === 1 && i.precio_venta > 0)
               .reduce((s, i) => s + i.precio_venta * i.cantidad, 0)
  );
  readonly subtotal       = computed(() => this._totales().subtotal);
  readonly inafecto       = computed(() => this._totales().inafecto);
  readonly igv            = computed(() => this._totales().igv);
  readonly total          = computed(() => this._totales().total);
  readonly gratuito       = computed(() => this._totales().gratuito);
  readonly descuentoMonto = computed(() => this._totales().descuentoMonto);
  readonly descuentoPct   = computed(() => {
    const t = this._totales();
    return t.totalAntesDescuento > 0 ? (t.descuentoMonto / t.totalAntesDescuento) * 100 : 0;
  });
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

  readonly clienteDisplay = computed(() =>
    this.cliente() ||
    ((this.tipoDoc() === 'boleta' || this.tipoDoc() === 'nota_venta') ? 'CLIENTES OTROS' : '')
  );

  readonly saleInfoSummary = computed((): SaleInfoSummary => ({
    tipoDocLabel:   TIPOS_DOC.find(t => t.value === this.tipoDoc())?.label ?? '',
    serie:          this.serie(),
    fechaLabel:     this.fechaLabel(),
    cliente:        this.cliente(),
    moneda:         this.moneda(),
    sigla:          this.sigla(),
    formaPago:      this.formaPago(),
    igvPorcentaje:  this.igvPorcentaje(),
    igvIncluido:    this.igvIncluido(),
    monto700:       this.monto700(),
    limitRetencion: this.limitRetencion(),
    tipoCambio:     this.tipoCambio(),
    descuento:      this.descuento(),
    cartLength:     this.cart().length,
  }));

  readonly cartTotals = computed((): CartTotals => ({
    subtotal:            this.subtotal(),
    brutoGravado:        this.brutoGravado(),
    inafecto:            this.inafecto(),
    igv:                 this.igv(),
    igvPorcentaje:       this.igvPorcentaje(),
    total:               this.total(),
    totalAntesDescuento: this._totales().totalAntesDescuento,
    gratuito:            this.gratuito(),
    descuentoMonto:      this.descuentoMonto(),
    descuentoPct:        this.descuentoPct(),
  }));

  constructor() {
    // Medios de pago para mapear al id_pago del payload
    this.saleService.getPaymentMethods()
      .pipe(takeUntilDestroyed())
      .subscribe(methods => this.paymentMethods.set(methods));

    // Búsqueda de clientes con debounce — usa sale-search para filtrar por tipo de comprobante
    this.clienteQuery$.pipe(
      debounceTime(300),
      switchMap(q => {
        if (q.trim().length < 2) { this.clienteSuggestions.set([]); return EMPTY; }
        const tipDoc = this.tipoDoc() === 'factura' ? 1 : 2;
        return this.clientsService.searchForSale(tipDoc, q.trim()).pipe(
          catchError(() => of([] as ClientSupplier[])),
        );
      }),
      takeUntilDestroyed(),
    ).subscribe(res => this.clienteSuggestions.set(res));

    // Productos desde API
    this.productsService.getAll({ limit: 200 })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next:  res => {
          this.productos.set(res.data.filter(p => p.estado === 1).map(p => this.mapToPosProd(p)));
          this.loadingProductos.set(false);
        },
        error: () => this.loadingProductos.set(false),
      });

    // Configuración de la empresa: monto700, limit_ret e igvIncluido
    const ciaId = this.auth.activeCompany()?.id;
    if (ciaId) {
      this.companySvc.getCompanyById(ciaId)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (cia: Cia) => {
            this.monto700.set(parseFloat(cia.monto700) || 700);
            this.limitRetencion.set(parseFloat(cia.limit_ret) || 700);
          },
        });

      this.companySvc.getCompanyIgv()
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: res => this.igvIncluido.set(res.c_igv === 1),
        });
    }

    // Tipo de cambio e IGV % — se recargan cuando cambia la fecha de emisión
    toObservable(this.fechaEmision).pipe(
      switchMap(fecha => {
        const f = this.fmtDateParam(fecha);
        return this.exchangeRateSvc.getByDate(f)
          .pipe(catchError(() => of({ paralelo: 0 })));
      }),
      takeUntilDestroyed(),
    ).subscribe(res => this.tipoCambio.set(parseFloat(String(res.paralelo ?? 0))));

    toObservable(this.fechaEmision).pipe(
      switchMap(fecha => this.exchangeRateSvc.getIgvByDate(this.fmtDateParam(fecha))
        .pipe(catchError(() => of({ igv: { porcentaje: 18 } })))
      ),
      takeUntilDestroyed(),
    ).subscribe(res => this.igvPorcentaje.set(res.igv?.porcentaje ?? 18));

    // Re-price cart when sale currency changes (skip initial emission)
    toObservable(this.moneda).pipe(
      skip(1),
      takeUntilDestroyed(),
    ).subscribe(newMoneda => {
      this.cart.update(items =>
        items.map(item => ({
          ...item,
          precio_venta: (newMoneda === 'USD'
            ? item.producto.precio_publico_dolar
            : item.producto.precio_publico_soles) ?? item.producto.precio_publico,
        }))
      );
    });
  }

  // ── Product creation ───────────────────────────────────────────────────────
  onProductSaved(p: Product) {
    const nuevo = this.mapToPosProd(p);
    this.productos.update(list => [...list, nuevo]);
    this.addToCart(nuevo);
    this.showProductForm.set(false);
    this.query.set('');
  }

  private fmtDateParam(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private colorForCategoria(cat: string | null): string {
    if (!cat) return COLOR_PALETTE[COLOR_PALETTE.length - 1];
    let h = 5381;
    for (let i = 0; i < cat.length; i++) h = ((h << 5) + h) ^ cat.charCodeAt(i);
    return COLOR_PALETTE[Math.abs(h) % COLOR_PALETTE.length];
  }

  private mapToPosProd(p: Product): PosProducto {
    const tc              = p.tipoCambio ?? this.tipoCambio();
    const precioSoles     = p.precioPublicoSoles ?? p.precioPublico;
    const precioMayorSoles = p.precioMayorSoles  ?? p.precioMayor;
    const precioDolar     = p.precioPublicoDolar  ?? (tc > 0 ? precioSoles / tc : 0);
    const precioMayorDolar = p.precioMayorDolar   ?? (tc > 0 ? precioMayorSoles / tc : 0);
    const saleMoneda      = this.moneda() === 'PEN' ? 1 : 2;
    return {
      id:                    p.id,
      sku:                   p.sku,
      descripcion:           p.descripcion,
      categoria:             p.categoria ?? 'General',
      precio_publico:        saleMoneda === 2 ? precioDolar : precioSoles,
      precio_publico_soles:  precioSoles,
      precio_publico_dolar:  precioDolar,
      precio_mayor_soles:    precioMayorSoles,
      precio_mayor_dolar:    precioMayorDolar,
      precio_costo:          p.costoSoles ?? p.costo,
      precio_min:            p.costoSoles ?? p.costo,
      stock:                 p.stock ?? 0,
      color:                 this.colorForCategoria(p.categoria),
      st_afecto:             (p.stAfecto === 1 ? 1 : 0) as 0 | 1,
      tipoMoneda:            p.tipoMoneda,
    };
  }

  // ── Cart operations ────────────────────────────────────────────────────────
  addToCart(p: PosProducto) {
    const precioVenta = (this.moneda() === 'USD' ? p.precio_publico_dolar : p.precio_publico_soles) ?? p.precio_publico;
    this.cart.update(items => {
      const idx = items.findIndex(i => i.producto.id === p.id);
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], cantidad: updated[idx].cantidad + 1 };
        return updated;
      }
      return [...items, { producto: p, cantidad: 1, precio_venta: precioVenta }];
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

  onClienteQuery(q: string) { this.clienteQuery$.next(q); }

  onClienteSelected(c: ClientSupplier) {
    this.cliente.set(c.display_name);
    this.clienteNumeroDoc.set(c.numero_documento);
    this.clienteSuggestions.set([]);
  }

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
    if (this.saving()) return;
    this.saving.set(true);

    this.saleService.create(this.buildPayload()).subscribe({
      next: () => {
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
        this.clienteNumeroDoc.set(null);
        this.clienteSuggestions.set([]);
        this.descuento.set(0);
        this.efectivo.set(0);
        this.metodoPago.set('efectivo');
        this.saving.set(false);
        this.showPago.set(false);
        this.showTicket.set(true);
        this.toaster.success('¡Venta registrada!', 'La venta se guardó correctamente.');
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Ocurrió un error al registrar la venta.';
        this.toaster.error('Error al registrar', Array.isArray(msg) ? msg[0] : msg);
        this.saving.set(false);
      },
    });
  }

  private buildPayload(): CreateSalePayload {
    const fecha     = this.fmtDateParam(this.fechaEmision());
    const fechaVenc = this.fechaVencimiento() ? this.fmtDateParam(this.fechaVencimiento()!) : fecha;
    const detrac    = this.detracConcepto();

    return {
      header: {
        tip_doc:                  this.TIP_DOC_MAP[this.tipoDoc()],
        fecha_emision:            fecha,
        fecha_vencimiento:        fechaVenc,
        moneda:                   this.moneda() === 'PEN' ? 1 : 2,
        forma_pago:               0,
        tipo_cambio:              this.tipoCambio() || 1,
        cliente_numero_documento: this.clienteNumeroDoc() ?? undefined,
        v_igv:                    this.igvPorcentaje(),
        st_stock:                 1,
        coddetrac:                detrac ? parseInt(detrac.codigo) : undefined,
        pordetrac:                detrac?.porcentaje ?? undefined,
      },
      items: this.cart().map(i => ({
        producto_id:  +i.producto.id,
        cantidad:     i.cantidad,
        precio_lista: (this.moneda() === 'USD' ? i.producto.precio_publico_dolar : i.producto.precio_publico_soles) ?? i.producto.precio_publico,
        precio_venta: i.precio_venta,
        descuento:    0,
      })),
      collections: this.formaPago() === 'contado' ? [{
        forma_pago_id: this.resolvePaymentMethodId(this.metodoPago()),
        monto:         this.total(),
      }] : [],
      cuotas: [],
    };
  }

  private resolvePaymentMethodId(metodo: MetodoPago): number {
    const methods = this.paymentMethods();
    const kw = metodo.toUpperCase();
    const found = methods.find(m =>
      m.descripcion?.toUpperCase().includes(kw) ||
      m.sigla_pago?.toUpperCase().includes(kw.slice(0, 3))
    );
    return found ? +found.id : (methods[0] ? +methods[0].id : 1);
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
