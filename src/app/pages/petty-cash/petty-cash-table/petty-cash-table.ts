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
import { Receipt, TIPO_OPCIONES } from '../../../core/models/petty-cash.model';
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
  receipts   = input<Receipt[]>([]);
  viewDetail = output<Receipt>();
  editReceipt = output<Receipt>();

  readonly tipoOpciones = TIPO_OPCIONES;

  readonly searchText = signal('');
  readonly startDate  = signal<Date | null>(this.firstOfMonth());
  readonly endDate    = signal<Date | null>(new Date());
  readonly tipoFiltro = signal<'' | 'INGRESO' | 'EGRESO'>('');

  private readonly fechaCellTpl     = viewChild.required<TemplateRef<unknown>>('fechaCellTpl');
  private readonly tipoCellTpl      = viewChild.required<TemplateRef<unknown>>('tipoCellTpl');
  private readonly numeroCellTpl    = viewChild.required<TemplateRef<unknown>>('numeroCellTpl');
  private readonly motivoCellTpl    = viewChild.required<TemplateRef<unknown>>('motivoCellTpl');
  private readonly entregadoCellTpl = viewChild.required<TemplateRef<unknown>>('entregadoCellTpl');
  private readonly importeCellTpl   = viewChild.required<TemplateRef<unknown>>('importeCellTpl');
  private readonly estadoCellTpl    = viewChild.required<TemplateRef<unknown>>('estadoCellTpl');
  private readonly actionCellTpl    = viewChild.required<TemplateRef<unknown>>('actionCellTpl');

  readonly filteredReceipts = computed(() => {
    const q    = this.searchText().toLowerCase().trim();
    const tipo = this.tipoFiltro();
    const from = this.startDate();
    const to   = this.endDate();

    return this.receipts().filter(r => {
      if (tipo) {
        const tipDoc = tipo === 'INGRESO' ? 77 : 78;
        if (r.tip_doc !== tipDoc) return false;
      }
      if (from || to) {
        const d = new Date(r.fecha + 'T00:00:00');
        if (from && d < from) return false;
        if (to) {
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          if (d > toEnd) return false;
        }
      }
      if (q) {
        return (
          (r.motivoDescripcion ?? '').toLowerCase().includes(q) ||
          r.entregado.toLowerCase().includes(q) ||
          r.numero.toLowerCase().includes(q)
        );
      }
      return true;
    });
  });

  readonly tableColumns = computed<TableColumn[]>(() => [
    { key: 'fecha',              label: 'Fecha',                                cellTemplate: this.fechaCellTpl() },
    { key: 'tip_doc',            label: 'Tipo',     class: 'text-center',       cellTemplate: this.tipoCellTpl() },
    { key: 'numero',             label: 'Número',                               cellTemplate: this.numeroCellTpl() },
    { key: 'motivoDescripcion',  label: 'Motivo',                               cellTemplate: this.motivoCellTpl() },
    { key: 'entregado',          label: 'Entregado a',                          cellTemplate: this.entregadoCellTpl() },
    { key: 'importe',            label: 'Importe',  class: 'text-right',        cellTemplate: this.importeCellTpl() },
    { key: 'estadoDescripcion',  label: 'Estado',   class: 'text-center',       cellTemplate: this.estadoCellTpl() },
    { key: '_actions',           label: '',         class: 'w-14 text-center',  cellTemplate: this.actionCellTpl() },
  ]);

  clearFilters() {
    this.searchText.set('');
    this.startDate.set(this.firstOfMonth());
    this.endDate.set(new Date());
    this.tipoFiltro.set('');
  }

  getMenuItems(r: Receipt): MenuItem[] {
    return [
      { label: 'Ver detalles', icon: 'pi pi-eye',    command: () => this.viewDetail.emit(r) },
      { label: 'Editar',       icon: 'pi pi-pencil', command: () => this.editReceipt.emit(r) },
      { separator: true },
      { label: 'Imprimir',     icon: 'pi pi-print' },
    ];
  }

  tipoLabel(r: Receipt): string { return r.tip_doc === 77 ? 'INGRESO' : 'EGRESO'; }
  tipoSev(r: Receipt): 'success' | 'danger' { return r.tip_doc === 77 ? 'success' : 'danger'; }
  estadoSev(r: Receipt): 'success' | 'danger' { return r.estado === 1 ? 'success' : 'danger'; }
  sigla(r: Receipt): string { return r.tipo_moneda === 1 ? 'S/' : '$'; }
  fmtNum(n: string | number): string { return Number(n).toFixed(2); }
  fmtDate(s: string): string {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private firstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
