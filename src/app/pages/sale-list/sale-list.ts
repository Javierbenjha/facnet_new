import {
  ChangeDetectionStrategy, Component, computed, DestroyRef,
  inject, OnInit, signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, EMPTY, finalize, Subject, switchMap } from 'rxjs';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Menu } from 'primeng/menu';
import { Drawer } from 'primeng/drawer';
import { MenuItem } from 'primeng/api';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { SaleService } from '../../core/services/sale';
import { Sale, SaleItem, SaleListFilters } from '../../core/models/sale.model';
import { TIPO_DOC_OPCIONES } from './sale-list.models';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Button, IconField, InputIcon, InputText,
    Select, DatePickerModule,
    TableModule, Tag, Menu, Drawer,
    PageHeader, KpiCard,
  ],
})
export class SaleList implements OnInit {
  private readonly saleService = inject(SaleService);
  private readonly destroyRef  = inject(DestroyRef);
  private readonly load$       = new Subject<SaleListFilters>();

  readonly tipoDocOpciones = TIPO_DOC_OPCIONES;

  // ── Filter signals ─────────────────────────────────────────────────────────
  readonly searchText    = signal('');
  readonly startDate     = signal<Date | null>(this.firstOfMonth());
  readonly endDate       = signal<Date | null>(new Date());
  readonly tipoDocFiltro = signal(0);

  // ── Pagination ─────────────────────────────────────────────────────────────
  readonly first    = signal(0);
  readonly pageSize = signal(10);
  private currentPage = 1;

  // ── Data signals ───────────────────────────────────────────────────────────
  readonly ventas         = signal<Sale[]>([]);
  readonly loading        = signal(false);
  readonly totalRegistros = signal(0);

  // ── Drawer ────────────────────────────────────────────────────────────────
  readonly showDetail    = signal(false);
  readonly selectedVenta = signal<Sale | null>(null);

  // ── KPI (from current page — indicativo) ──────────────────────────────────
  readonly metrics = computed(() => {
    const active  = this.ventas().filter(v => v.estadoDescripcion !== 'CANCELLED' && v.tip_doc !== 7);
    const soles   = active.filter(v => v.moneda === 1);
    const dolares = active.filter(v => v.moneda === 2);
    const sum     = (arr: Sale[]) => arr.reduce((s, v) => s + parseFloat(v.total), 0);
    return {
      totalVentas:     this.totalRegistros(),
      ingresosSoles:   sum(soles),
      ingresosDolares: sum(dolares),
      promedioSoles:   soles.length   ? sum(soles)   / soles.length   : 0,
      promedioDolares: dolares.length ? sum(dolares) / dolares.length : 0,
    };
  });

  ngOnInit() {
    this.load$.pipe(
      debounceTime(300),
      switchMap(filters => {
        this.loading.set(true);
        return this.saleService.list(filters).pipe(
          catchError(() => EMPTY),
          finalize(() => this.loading.set(false)),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(res => {
      this.ventas.set(res.data);
      this.totalRegistros.set(res.meta.total);
    });

    this.triggerLoad();
  }

  // ── Load trigger ───────────────────────────────────────────────────────────
  private triggerLoad() {
    const q    = this.searchText().trim();
    const tipo = this.tipoDocFiltro();
    const from = this.startDate();
    const to   = this.endDate();
    this.load$.next({
      page:  this.currentPage,
      limit: this.pageSize(),
      ...(tipo !== 0 ? { tip_doc: tipo }    : {}),
      ...(q          ? { cliente: q }       : {}),
      ...(from       ? { fecha_inicio: this.toApiDate(from) } : {}),
      ...(to         ? { fecha_fin:    this.toApiDate(to)   } : {}),
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const rows  = event.rows ?? this.pageSize();
    const first = event.first ?? 0;
    this.first.set(first);
    this.pageSize.set(rows);
    this.currentPage = Math.floor(first / rows) + 1;
    this.triggerLoad();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.first.set(0);
    this.triggerLoad();
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  openDetail(v: Sale) {
    this.selectedVenta.set(v);
    this.showDetail.set(true);
  }

  closeDetail() {
    this.showDetail.set(false);
  }

  clearFilters() {
    this.searchText.set('');
    this.startDate.set(this.firstOfMonth());
    this.endDate.set(new Date());
    this.tipoDocFiltro.set(0);
    this.currentPage = 1;
    this.first.set(0);
    this.triggerLoad();
  }

  getMenuItems(v: Sale): MenuItem[] {
    const anulado    = v.estadoDescripcion === 'CANCELLED';
    const esFiscal   = [1, 3, 7, 8].includes(v.tip_doc);
    const tieneSaldo = parseFloat(v.saldo) > 0;
    return [
      { label: 'Ver detalles',   icon: 'pi pi-eye',    command: () => this.openDetail(v) },
      ...(tieneSaldo && !anulado
        ? [{ label: 'Ir a Cobranza', icon: 'pi pi-money-bill' }]
        : []),
      ...(esFiscal
        ? [{ label: 'Aplicar Nota de Crédito', icon: 'pi pi-file-invoice', disabled: anulado }]
        : []),
      { separator: true },
      { label: 'Reimprimir Ticket', icon: 'pi pi-print'    },
      { label: 'Descargar Reporte', icon: 'pi pi-download' },
      ...([1, 3, 7, 8].includes(v.tip_doc)
        ? [{ label: 'Envío SUNAT', icon: 'pi pi-send',
             disabled: v.estado_sunat === 'ACEPTADA' }]
        : []),
      { separator: true },
      { label: 'Anular', icon: 'pi pi-trash', disabled: anulado,
        styleClass: 'text-red-500', command: () => this.cancel(v) },
    ];
  }

  cancel(v: Sale) {
    this.saleService.cancel(v.tip_doc, v.serie, v.correlativo).subscribe({
      next: updated => this.ventas.update(
        list => list.map(s => s.serie === v.serie && s.correlativo === v.correlativo ? updated : s)
      ),
    });
  }

  // ── Severity helpers ───────────────────────────────────────────────────────
  estadoSev(v: Sale): 'success' | 'danger' {
    return v.estadoDescripcion === 'CANCELLED' ? 'danger' : 'success';
  }

  pagoSev(v: Sale): 'success' | 'info' | 'warn' {
    const ep = this.estadoPago(v);
    return ep === 'CANCELADO' ? 'success' : ep === 'PARCIAL' ? 'info' : 'warn';
  }

  sunatSev(s: string | null): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (s) {
      case 'ACEPTADA':  return 'success';
      case 'RECHAZADA': return 'danger';
      case 'ERROR':     return 'secondary';
      default:          return 'warn';
    }
  }

  // ── Field adapters ─────────────────────────────────────────────────────────
  private readonly DOC_SIGLA: Record<number, string> = {
    1: 'FAC', 3: 'BOL', 7: 'N/C', 8: 'N/D', 41: 'DCI',
  };

  siglaDoc(v: Sale): string {
    return this.DOC_SIGLA[v.tip_doc] ?? v.tipDocDescripcion ?? '?';
  }

  siglaMoneda(v: Sale): 'S/' | '$' {
    return v.moneda === 2 ? '$' : 'S/';
  }

  estadoLabel(v: Sale): string {
    return v.estadoDescripcion === 'CANCELLED' ? 'ANULADO' : 'ACTIVO';
  }

  estadoPago(v: Sale): 'PENDIENTE' | 'PARCIAL' | 'CANCELADO' {
    const saldo = parseFloat(v.saldo);
    const total = parseFloat(v.total);
    if (saldo <= 0)       return 'CANCELADO';
    if (saldo < total)    return 'PARCIAL';
    return 'PENDIENTE';
  }

  // ── Format helpers ─────────────────────────────────────────────────────────
  fmtNum(n: number | string): string {
    return parseFloat(String(n)).toFixed(2);
  }

  signedAmt(v: Sale, n: number | string): number {
    const val = typeof n === 'string' ? parseFloat(n) : n;
    return v.tip_doc === 7 ? -val : val;
  }

  fmtDate(s: string | null): string {
    if (!s) return '—';
    const d = new Date(s.slice(0, 10) + 'T12:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  itemTotal(d: SaleItem): number {
    return parseFloat(d.cantidad) * parseFloat(d.precio_venta);
  }

  private toApiDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  private firstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
