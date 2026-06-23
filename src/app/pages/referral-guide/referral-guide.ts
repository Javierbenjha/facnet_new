import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { ReferralGuideTable } from './referral-guide-table/referral-guide-table';
import { ReferralGuideForm } from './referral-guide-form/referral-guide-form';
import { GuiaRemision, GUIAS_MOCK, EstadoSunat } from './referral-guide.models';

@Component({
  selector: 'app-referral-guide',
  templateUrl: './referral-guide.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Button, Tag, InputText,
    PageHeader, KpiCard,
    ReferralGuideTable, ReferralGuideForm,
  ],
})
export class ReferralGuide {
  readonly guias      = signal<GuiaRemision[]>(GUIAS_MOCK);
  readonly editing    = signal<'new' | null>(null);
  readonly busqueda   = signal('');

  // ── Detail drawer ──────────────────────────────────────────────────────────
  readonly showDetail = signal(false);
  readonly selected   = signal<GuiaRemision | null>(null);

  // ── KPIs ───────────────────────────────────────────────────────────────────
  readonly metrics = computed(() => {
    const total    = this.guias().length;
    const activos  = this.guias().filter(g => g.estado === 'ACTIVO').length;
    const aceptadas = this.guias().filter(g => g.estado_sunat === 'ACEPTADO').length;
    const pendientes = this.guias().filter(g => g.estado_sunat === 'PENDIENTE').length;
    return { total, activos, aceptadas, pendientes };
  });

  // ── Filtered list ──────────────────────────────────────────────────────────
  readonly guiasFiltradas = computed<GuiaRemision[]>(() => {
    const q = this.busqueda().toLowerCase().trim();
    if (!q) return this.guias();
    return this.guias().filter(g =>
      g.serie.toLowerCase().includes(q)    ||
      g.correlativo.includes(q)            ||
      g.cliente.toLowerCase().includes(q)  ||
      g.motivo.toLowerCase().includes(q)   ||
      (g.empresa_transporte ?? '').toLowerCase().includes(q) ||
      (g.conductor ?? '').toLowerCase().includes(q)
    );
  });

  // ── Methods ────────────────────────────────────────────────────────────────
  openNew()   { this.editing.set('new'); }
  closeForm() { this.editing.set(null); }

  onSaved(data: Partial<GuiaRemision>) {
    const nueva: GuiaRemision = {
      id: String(Date.now()),
      serie: 'T001',
      correlativo: String(this.guias().length + 1).padStart(8, '0'),
      fecha: new Date().toISOString().split('T')[0],
      fecha_traslado: new Date().toISOString().split('T')[0],
      estado: 'ACTIVO',
      estado_sunat: 'PENDIENTE',
      detalles: [],
      destino_direccion: '',
      partida_direccion: '',
      cliente: '',
      modalidad: 'PUBLICO',
      peso_total: 0,
      motivo: '',
      ...data,
    } as GuiaRemision;
    this.guias.update(list => [nueva, ...list]);
  }

  openDetail(g: GuiaRemision) {
    this.selected.set(g);
    this.showDetail.set(true);
  }
  closeDetail() { this.showDetail.set(false); }

  onAnular(g: GuiaRemision) {
    this.guias.update(list =>
      list.map(item => item.id === g.id ? { ...item, estado: 'ANULADO' } : item)
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  sunatSev(s: EstadoSunat): 'success' | 'warn' | 'danger' | 'secondary' {
    return { ACEPTADO: 'success', PENDIENTE: 'warn', RECHAZADO: 'danger', NO_ENVIADO: 'secondary' }[s] as any;
  }
  sunatLabel(s: EstadoSunat) {
    return { ACEPTADO: 'Aceptado', PENDIENTE: 'Pendiente', RECHAZADO: 'Rechazado', NO_ENVIADO: 'No enviado' }[s];
  }
  estadoSev(e: string): 'success' | 'danger' { return e === 'ACTIVO' ? 'success' : 'danger'; }
  fmtDate(s: string) {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
