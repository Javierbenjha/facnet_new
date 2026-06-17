import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Popover } from 'primeng/popover';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import {
  VentaHistorial, VENTAS_MOCK, TIPO_DOC_OPCIONES,
  EstadoVenta, EstadoPago, EstadoSunat,
} from './sale-list.models';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Button, IconField, InputIcon, InputText,
    Select, DatePickerModule,
    TableModule, Tag, Popover, Menu,
    PageHeader, KpiCard,
  ],
})
export class SaleList {
  readonly tipoDocOpciones = TIPO_DOC_OPCIONES;

  // ── Filter state ───────────────────────────────────────────────────────────
  readonly searchText    = signal('');
  readonly startDate     = signal<Date | null>(this.firstOfMonth());
  readonly endDate       = signal<Date | null>(new Date());
  readonly tipoDocFiltro = signal(0);

  // ── Drawer state ──────────────────────────────────────────────────────────
  readonly showDetail    = signal(false);
  readonly selectedVenta = signal<VentaHistorial | null>(null);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly filteredVentas = computed(() => {
    const q    = this.searchText().toLowerCase().trim();
    const tipo = this.tipoDocFiltro();
    const from = this.startDate();
    const to   = this.endDate();

    return VENTAS_MOCK.filter(v => {
      if (tipo !== 0 && v.tip_doc !== tipo) return false;

      if (from || to) {
        const d = new Date(v.fecha_emision + 'T00:00:00');
        if (from && d < from) return false;
        if (to) {
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          if (d > toEnd) return false;
        }
      }

      if (q) {
        const num = `${v.sigla_documento}${v.serie}-${v.correlativo}`.toLowerCase();
        return num.includes(q) || v.cliente.toLowerCase().includes(q) || v.ruc_dni.toLowerCase().includes(q);
      }
      return true;
    });
  });

  readonly metrics = computed(() => {
    const ventas  = this.filteredVentas().filter(v => v.estado !== 'ANULADO' && v.tip_doc !== 7);
    const soles   = ventas.filter(v => v.moneda === 'PEN');
    const dolares = ventas.filter(v => v.moneda === 'USD');
    return {
      totalVentas:     this.filteredVentas().length,
      ingresosSoles:   soles.reduce((s, v) => s + v.total, 0),
      ingresosDolares: dolares.reduce((s, v) => s + v.total, 0),
      promedioSoles:   soles.length   ? soles.reduce((s, v) => s + v.total, 0)   / soles.length   : 0,
      promedioDolares: dolares.length ? dolares.reduce((s, v) => s + v.total, 0) / dolares.length : 0,
    };
  });

  // ── Methods ────────────────────────────────────────────────────────────────
  openDetail(v: VentaHistorial) {
    this.selectedVenta.set(v);
    this.showDetail.set(true);
  }

  closeDetail() {
    this.showDetail.set(false);
  }

  getMenuItems(v: VentaHistorial): MenuItem[] {
    const anulado  = v.estado === 'ANULADO';
    const esFiscal = v.tip_doc === 1 || v.tip_doc === 2;
    return [
      { label: 'Ver detalles',   icon: 'pi pi-eye',     command: () => this.openDetail(v) },
      { label: 'Editar',         icon: 'pi pi-pencil',  disabled: anulado },
      ...(v.saldo > 0 && !anulado
        ? [{ label: 'Ir a Cobranza', icon: 'pi pi-money-bill' }]
        : []),
      ...(esFiscal
        ? [{ label: 'Aplicar Nota de Crédito', icon: 'pi pi-file-invoice', disabled: anulado }]
        : []),
      { separator: true },
      { label: 'Reimprimir Ticket', icon: 'pi pi-print'    },
      { label: 'Descargar Reporte', icon: 'pi pi-download' },
      ...([1, 2, 7, 8].includes(v.tip_doc)
        ? [{ label: 'Envío SUNAT', icon: 'pi pi-send', disabled: v.estado_sunat === 'ACEPTADA' }]
        : []),
      { separator: true },
      { label: 'Anular', icon: 'pi pi-trash', disabled: anulado, styleClass: 'text-red-500' },
    ];
  }

  clearFilters() {
    this.searchText.set('');
    this.startDate.set(this.firstOfMonth());
    this.endDate.set(new Date());
    this.tipoDocFiltro.set(0);
  }

  // ── Severity helpers ───────────────────────────────────────────────────────
  estadoSev(e: EstadoVenta): 'success' | 'danger' {
    return e === 'ACTIVO' ? 'success' : 'danger';
  }

  pagoSev(e: EstadoPago): 'success' | 'info' | 'warn' {
    return e === 'CANCELADO' ? 'success' : e === 'PARCIAL' ? 'info' : 'warn';
  }

  sunatSev(e: EstadoSunat): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (e) {
      case 'ACEPTADA':  return 'success';
      case 'RECHAZADA': return 'danger';
      case 'ERROR':     return 'secondary';
      default:          return 'warn';
    }
  }

  // ── Format helpers ─────────────────────────────────────────────────────────
  fmtNum(n: number): string { return n.toFixed(2); }
  signedAmt(v: VentaHistorial, n: number): number { return v.tip_doc === 7 ? -n : n; }
  fmtDate(s: string): string {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  itemTotal(d: { cantidad: number; precio_venta: number }): number {
    return d.cantidad * d.precio_venta;
  }

  private firstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
