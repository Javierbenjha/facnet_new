import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { PettyCashTable } from './petty-cash-table/petty-cash-table';
import { PettyCashForm } from './petty-cash-form/petty-cash-form';
import { Receipt } from '../../core/models/petty-cash.model';
import { PettyCashService } from '../../core/services/petty-cash';
import { Toaster } from '../../core/services/toast';

@Component({
  selector: 'app-petty-cash',
  templateUrl: './petty-cash.html',
  styleUrl: './petty-cash.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Tag, PageHeader, KpiCard, PettyCashTable, PettyCashForm],
})
export class PettyCash implements OnInit {
  private readonly svc     = inject(PettyCashService);
  private readonly toaster = inject(Toaster);

  readonly receipts = signal<Receipt[]>([]);
  readonly loading  = signal(false);

  readonly editing = signal<'new' | Receipt | null>(null);

  readonly showDetail      = signal(false);
  readonly selectedReceipt = signal<Receipt | null>(null);

  readonly metrics = computed(() => {
    const data     = this.receipts();
    const ingresos = data.filter(r => r.tip_doc === 77).reduce((s, r) => s + Number(r.importe), 0);
    const egresos  = data.filter(r => r.tip_doc === 78).reduce((s, r) => s + Number(r.importe), 0);
    return {
      totalMovimientos: data.length,
      ingresos,
      egresos,
      saldo: ingresos - egresos,
    };
  });

  ngOnInit() { this.loadReceipts(); }

  openNew()             { this.editing.set('new'); }
  openEdit(r: Receipt)  { this.closeDetail(); this.editing.set(r); }
  closeForm()           { this.editing.set(null); }

  onSaved(receipt: Receipt) {
    this.receipts.update(list => {
      const idx = list.findIndex(r => r.id === receipt.id);
      return idx === -1
        ? [receipt, ...list]
        : list.map(r => r.id === receipt.id ? receipt : r);
    });
  }

  openDetail(r: Receipt) {
    this.selectedReceipt.set(r);
    this.showDetail.set(true);
  }

  closeDetail() { this.showDetail.set(false); }

  fmtNum(n: number): string { return n.toFixed(2); }
  fmtDate(s: string): string {
    const d = new Date(s);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private loadReceipts() {
    this.loading.set(true);
    this.svc.getReceipts({ limit: 50 }).subscribe({
      next:  res => { this.receipts.set(res.data); this.loading.set(false); },
      error: ()  => { this.toaster.error('Error', 'No se pudieron cargar los recibos'); this.loading.set(false); },
    });
  }
}
