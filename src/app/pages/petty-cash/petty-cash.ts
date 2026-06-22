import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { PettyCashTable } from './petty-cash-table/petty-cash-table';
import { PettyCashForm } from './petty-cash-form/petty-cash-form';
import { MovimientoCajaChica, MOVIMIENTOS_MOCK, SALDO_INICIAL, TipoMovimiento } from './petty-cash.models';

@Component({
  selector: 'app-petty-cash',
  templateUrl: './petty-cash.html',
  styleUrl: './petty-cash.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Tag, PageHeader, KpiCard, PettyCashTable, PettyCashForm],
})
export class PettyCash {
  readonly movimientos = signal<MovimientoCajaChica[]>(MOVIMIENTOS_MOCK);
  readonly saldoActual = signal(350.00);

  // ── Form modal state ───────────────────────────────────────────────────────
  readonly editing = signal<'new' | null>(null);

  // ── Detail drawer state ────────────────────────────────────────────────────
  readonly showDetail         = signal(false);
  readonly selectedMovimiento = signal<MovimientoCajaChica | null>(null);

  // ── KPI metrics (over full dataset) ───────────────────────────────────────
  readonly metrics = computed(() => {
    const activos  = this.movimientos().filter(m => m.estado === 'ACTIVO');
    const ingresos = activos.filter(m => m.tipo === 'INGRESO').reduce((s, m) => s + m.monto, 0);
    const egresos  = activos.filter(m => m.tipo === 'EGRESO').reduce((s, m) => s + m.monto, 0);
    return {
      totalMovimientos: this.movimientos().length,
      ingresos,
      egresos,
      saldo: SALDO_INICIAL + ingresos - egresos,
    };
  });

  // ── Methods ────────────────────────────────────────────────────────────────
  openNew()    { this.editing.set('new'); }
  closeForm()  { this.editing.set(null); }

  onSaved(data: { tipo: TipoMovimiento; concepto: string; monto: number }) {
    const delta = data.tipo === 'INGRESO' ? data.monto : -data.monto;
    this.saldoActual.update(s => s + delta);
  }

  openDetail(m: MovimientoCajaChica) {
    this.selectedMovimiento.set(m);
    this.showDetail.set(true);
  }

  closeDetail() { this.showDetail.set(false); }

  // ── Severity helpers (needed by the detail drawer in the template) ─────────
  tipoSev(t: TipoMovimiento): 'success' | 'danger' {
    return t === 'INGRESO' ? 'success' : 'danger';
  }

  estadoSev(e: string): 'success' | 'danger' {
    return e === 'ACTIVO' ? 'success' : 'danger';
  }

  fmtNum(n: number): string { return n.toFixed(2); }
  fmtDate(s: string): string {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
