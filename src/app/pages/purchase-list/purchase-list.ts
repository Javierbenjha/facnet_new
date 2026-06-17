import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { PurchaseTable } from './purchase-table/purchase-table';
import { PurchaseForm } from './purchase-form/purchase-form';
import { CompraHistorial, COMPRAS_MOCK } from './purchase-list.models';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, PageHeader, KpiCard, PurchaseTable, PurchaseForm],
})
export class PurchaseList {
  readonly compras = signal<CompraHistorial[]>(COMPRAS_MOCK);

  // ── Form modal state ───────────────────────────────────────────────────────
  readonly editing = signal<CompraHistorial | 'new' | null>(null);

  // ── Detail drawer state ────────────────────────────────────────────────────
  readonly showDetail     = signal(false);
  readonly selectedCompra = signal<CompraHistorial | null>(null);

  // ── KPI metrics (sobre todo el dataset, sin filtros) ───────────────────────
  readonly metrics = computed(() => {
    const activas = this.compras().filter(c => c.estado !== 'ANULADA' && c.tip_doc !== 7);
    const soles   = activas.filter(c => c.moneda === 'PEN');
    const dolares = activas.filter(c => c.moneda === 'USD');
    return {
      total:         this.compras().length,
      gastosSoles:   soles.reduce((s, c) => s + c.total, 0),
      gastosDolares: dolares.reduce((s, c) => s + c.total, 0),
    };
  });

  // ── Methods ────────────────────────────────────────────────────────────────
  openNew()                    { this.editing.set('new'); }
  openEdit(c: CompraHistorial) { this.editing.set(c); }
  closeForm()                  { this.editing.set(null); }

  openDetail(c: CompraHistorial) {
    this.selectedCompra.set(c);
    this.showDetail.set(true);
  }
  closeDetail() { this.showDetail.set(false); }

  fmtNum(n: number): string { return n.toFixed(2); }
  fmtDate(s: string): string {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  itemTotal(d: { cantidad: number; precio_venta: number }): number {
    return d.cantidad * d.precio_venta;
  }
}
