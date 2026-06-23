import { ChangeDetectionStrategy, Component, computed, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { Tag } from 'primeng/tag';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { EstadoMovimiento, MovimientoCajaChica, TipoMovimiento, TIPO_OPCIONES } from '../../../core/models/petty-cash.model';
import { DataTable, TableColumn } from '../../../shared/data-table/data-table';

@Component({
  selector: 'app-petty-cash-table',
  templateUrl: './petty-cash-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Tag, Menu, Button, Select, InputText, IconField, InputIcon, DatePickerModule,
    DataTable,
  ],
})
export class PettyCashTable {
  movimientos    = input<MovimientoCajaChica[]>([]);
  viewDetail     = output<MovimientoCajaChica>();
  editMovimiento = output<MovimientoCajaChica>();

  readonly tipoOpciones = TIPO_OPCIONES;

  // ── Filter state ───────────────────────────────────────────────────────────
  readonly searchText = signal('');
  readonly startDate  = signal<Date | null>(this.firstOfMonth());
  readonly endDate    = signal<Date | null>(new Date());
  readonly tipoFiltro = signal<'' | TipoMovimiento>('');

  // ── Cell template refs ─────────────────────────────────────────────────────
  private readonly fechaCellTpl      = viewChild.required<TemplateRef<unknown>>('fechaCellTpl');
  private readonly tipoCellTpl       = viewChild.required<TemplateRef<unknown>>('tipoCellTpl');
  private readonly serieCellTpl      = viewChild.required<TemplateRef<unknown>>('serieCellTpl');
  private readonly motivoCellTpl     = viewChild.required<TemplateRef<unknown>>('motivoCellTpl');
  private readonly entregadoCellTpl  = viewChild.required<TemplateRef<unknown>>('entregadoCellTpl');
  private readonly importeCellTpl    = viewChild.required<TemplateRef<unknown>>('importeCellTpl');
  private readonly estadoCellTpl     = viewChild.required<TemplateRef<unknown>>('estadoCellTpl');
  private readonly actionCellTpl     = viewChild.required<TemplateRef<unknown>>('actionCellTpl');

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly filteredMovimientos = computed(() => {
    const q    = this.searchText().toLowerCase().trim();
    const tipo = this.tipoFiltro();
    const from = this.startDate();
    const to   = this.endDate();

    return this.movimientos().filter(m => {
      if (tipo && m.tipo !== tipo) return false;

      if (from || to) {
        const d = new Date(m.fecha + 'T00:00:00');
        if (from && d < from) return false;
        if (to) {
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          if (d > toEnd) return false;
        }
      }

      if (q) {
        return (
          m.motivo.toLowerCase().includes(q) ||
          m.entregado_a.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.serie.toLowerCase().includes(q)
        );
      }
      return true;
    });
  });

  readonly tableColumns = computed<TableColumn[]>(() => [
    { key: 'fecha',       label: 'Fecha',                                 cellTemplate: this.fechaCellTpl() },
    { key: 'tipo',        label: 'Tipo',      class: 'text-center',       cellTemplate: this.tipoCellTpl() },
    { key: 'serie',       label: 'Serie',                                 cellTemplate: this.serieCellTpl() },
    { key: 'motivo',      label: 'Motivo',                                cellTemplate: this.motivoCellTpl() },
    { key: 'entregado_a', label: 'Entregado a',                           cellTemplate: this.entregadoCellTpl() },
    { key: 'importe',     label: 'Importe',   class: 'text-right',        cellTemplate: this.importeCellTpl() },
    { key: 'estado',      label: 'Estado',    class: 'text-center',       cellTemplate: this.estadoCellTpl() },
    { key: '_actions',    label: '',          class: 'w-14 text-center',  cellTemplate: this.actionCellTpl() },
  ]);

  // ── Methods ────────────────────────────────────────────────────────────────
  clearFilters() {
    this.searchText.set('');
    this.startDate.set(this.firstOfMonth());
    this.endDate.set(new Date());
    this.tipoFiltro.set('');
  }

  getMenuItems(m: MovimientoCajaChica): MenuItem[] {
    const anulado = m.estado === 'ANULADO';
    return [
      { label: 'Ver detalles', icon: 'pi pi-eye',    command: () => this.viewDetail.emit(m) },
      { label: 'Editar',       icon: 'pi pi-pencil', command: () => this.editMovimiento.emit(m), disabled: anulado },
      { separator: true },
      { label: 'Imprimir',     icon: 'pi pi-print'  },
      { separator: true },
      { label: 'Anular',       icon: 'pi pi-trash',  disabled: anulado, styleClass: 'text-red-500' },
    ];
  }

  tipoSev(t: TipoMovimiento): 'success' | 'danger' {
    return t === 'INGRESO' ? 'success' : 'danger';
  }

  estadoSev(e: EstadoMovimiento): 'success' | 'danger' {
    return e === 'ACTIVO' ? 'success' : 'danger';
  }

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
