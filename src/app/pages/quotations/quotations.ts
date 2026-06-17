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
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import {
  Cotizacion, EstadoCotizacion, EstadoFacturacion,
  COTIZACIONES_MOCK,
} from './quotations.models';

type StatusFiltro = 'todas' | EstadoCotizacion;

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.html',
  styleUrl: './quotations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Button, IconField, InputIcon, InputText,
    Select, DatePickerModule,
    TableModule, Tag, Menu, Tooltip,
    PageHeader, KpiCard,
  ],
})
export class Quotations {
  readonly cotizaciones = signal<Cotizacion[]>(COTIZACIONES_MOCK);

  readonly searchTerm   = signal('');
  readonly startDate    = signal<Date | null>(this.firstOfMonth());
  readonly endDate      = signal<Date | null>(new Date());
  readonly statusFilter = signal<StatusFiltro>('todas');

  readonly showDetail  = signal(false);
  readonly selectedCot = signal<Cotizacion | null>(null);

  readonly statusOptions = [
    { label: 'Todas',     value: 'todas'     },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Aprobada',  value: 'APROBADA'  },
    { label: 'Anulada',   value: 'ANULADA'   },
  ];

  readonly tableData = computed(() => {
    const q    = this.searchTerm().toLowerCase().trim();
    const from = this.startDate();
    const to   = this.endDate();
    const s    = this.statusFilter();

    return this.cotizaciones().filter(c => {
      if (s !== 'todas' && c.estado !== s) return false;

      if (from || to) {
        const d = new Date(c.fecha_emision + 'T00:00:00');
        if (from && d < from) return false;
        if (to) {
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          if (d > toEnd) return false;
        }
      }

      if (q) {
        const num = `${c.serie}-${c.correlativo}`.toLowerCase();
        return (
          num.includes(q) ||
          c.cliente_nombre.toLowerCase().includes(q) ||
          c.cliente_documento.includes(q)
        );
      }
      return true;
    });
  });

  readonly metrics = computed(() => {
    const all = this.cotizaciones();
    return {
      total:      all.length,
      pendientes: all.filter(c => c.estado === 'PENDIENTE').length,
      aprobadas:  all.filter(c => c.estado === 'APROBADA').length,
      anuladas:   all.filter(c => c.estado === 'ANULADA').length,
    };
  });

  getMenuItems(c: Cotizacion): MenuItem[] {
    const anulada   = c.estado === 'ANULADA';
    const facturada = c.estado_facturacion === 'FACTURADA';
    return [
      { label: 'Ver detalles',  icon: 'pi pi-eye',      command: () => this.openDetail(c) },
      { label: 'Editar',        icon: 'pi pi-pencil',   command: () => {},                 disabled: anulada || facturada },
      { label: 'Imprimir',      icon: 'pi pi-print',    command: () => {} },
      { label: 'Descargar PDF', icon: 'pi pi-file-pdf', command: () => {} },
      { separator: true },
      { label: 'Generar Venta', icon: 'pi pi-receipt',  command: () => {},                 disabled: anulada || facturada },
      { separator: true },
      { label: 'Anular',        icon: 'pi pi-ban',      command: () => this.anular(c),     disabled: anulada || facturada },
    ];
  }

  openDetail(c: Cotizacion) {
    this.selectedCot.set(c);
    this.showDetail.set(true);
  }

  closeDetail() { this.showDetail.set(false); }

  anular(c: Cotizacion) {
    this.cotizaciones.set(
      this.cotizaciones().map(x =>
        x.id === c.id ? { ...x, estado: 'ANULADA' as EstadoCotizacion } : x
      )
    );
  }

  clearFilters() {
    this.searchTerm.set('');
    this.startDate.set(this.firstOfMonth());
    this.endDate.set(new Date());
    this.statusFilter.set('todas');
  }

  exportar() {
    const data    = this.tableData();
    const headers = [
      'Serie', 'Correlativo', 'Fecha Emisión', 'Fecha Vencimiento',
      'Moneda', 'Forma de Pago', 'Cliente', 'RUC/DNI',
      'Subtotal', 'IGV', 'Descuento', 'Total',
      'Estado', 'Estado Facturación',
    ];
    const rows = data.map(c => [
      c.serie, c.correlativo, c.fecha_emision, c.fecha_vencimiento,
      c.moneda, c.forma_pago, c.cliente_nombre, c.cliente_documento,
      c.subtotal, c.igv, c.descuento, c.total,
      c.estado, c.estado_facturacion,
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `cotizaciones_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  estadoSev(e: EstadoCotizacion): 'warn' | 'success' | 'danger' {
    if (e === 'APROBADA') return 'success';
    if (e === 'ANULADA')  return 'danger';
    return 'warn';
  }

  factSev(e: EstadoFacturacion): 'warn' | 'success' {
    return e === 'FACTURADA' ? 'success' : 'warn';
  }

  isVencido(c: Cotizacion): boolean {
    if (c.estado === 'ANULADA' || c.estado_facturacion === 'FACTURADA') return false;
    return new Date(c.fecha_vencimiento + 'T00:00:00') < new Date();
  }

  fmtDate(s: string): string {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  fmtNum(n: number): string { return n.toFixed(2); }

  itemTotal(d: { cantidad: number; precio_venta: number }): number {
    return d.cantidad * d.precio_venta;
  }

  private firstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
