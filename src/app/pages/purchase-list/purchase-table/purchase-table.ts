import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { Tag } from 'primeng/tag';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CompraHistorial, EstadoCompra, TIPO_DOC_FILTRO_COMPRA } from '../purchase-list.models';

@Component({
  selector: 'app-purchase-table',
  templateUrl: './purchase-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TableModule, Tag, Menu,
    Button, Select, InputText, IconField, InputIcon, DatePickerModule,
  ],
})
export class PurchaseTable {
  compras     = input<CompraHistorial[]>([]);
  editCompra  = output<CompraHistorial>();
  viewDetail  = output<CompraHistorial>();

  readonly tipoDocOpciones = TIPO_DOC_FILTRO_COMPRA;

  // ── Filter state ───────────────────────────────────────────────────────────
  readonly searchText    = signal('');
  readonly startDate     = signal<Date | null>(this.firstOfMonth());
  readonly endDate       = signal<Date | null>(new Date());
  readonly tipoDocFiltro = signal(0);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly filteredCompras = computed(() => {
    const q    = this.searchText().toLowerCase().trim();
    const tipo = this.tipoDocFiltro();
    const from = this.startDate();
    const to   = this.endDate();

    return this.compras().filter(c => {
      if (tipo !== 0 && c.tip_doc !== tipo) return false;

      if (from || to) {
        const d = new Date(c.fecha_compra + 'T00:00:00');
        if (from && d < from) return false;
        if (to) {
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          if (d > toEnd) return false;
        }
      }

      if (q) {
        const num = `${c.sigla_documento}${c.serie}-${c.correlativo}`.toLowerCase();
        return (
          num.includes(q) ||
          c.proveedor.toLowerCase().includes(q) ||
          c.ruc_proveedor.toLowerCase().includes(q)
        );
      }
      return true;
    });
  });

  // ── Methods ────────────────────────────────────────────────────────────────
  clearFilters() {
    this.searchText.set('');
    this.startDate.set(this.firstOfMonth());
    this.endDate.set(new Date());
    this.tipoDocFiltro.set(0);
  }

  getMenuItems(c: CompraHistorial): MenuItem[] {
    const anulada = c.estado === 'ANULADA';
    return [
      { label: 'Ver detalles', icon: 'pi pi-eye',    command: () => this.viewDetail.emit(c) },
      { label: 'Editar',       icon: 'pi pi-pencil', command: () => this.editCompra.emit(c), disabled: anulada },
      { separator: true },
      { label: 'Descargar',    icon: 'pi pi-download' },
      { separator: true },
      { label: 'Eliminar',     icon: 'pi pi-trash',  disabled: anulada, styleClass: 'text-red-500' },
    ];
  }

  // ── Severity helpers ───────────────────────────────────────────────────────
  estadoSev(e: EstadoCompra): 'success' | 'warn' | 'danger' {
    return e === 'PAGADA' ? 'success' : e === 'PENDIENTE' ? 'warn' : 'danger';
  }

  // ── Format helpers ─────────────────────────────────────────────────────────
  fmtNum(n: number): string { return n.toFixed(2); }
  fmtDate(s: string): string {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private firstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
