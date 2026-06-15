import { Component, TemplateRef, ChangeDetectionStrategy, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface TableColumn {
  key: string;
  label: string;
  class?: string;
  cellTemplate?: TemplateRef<unknown> | null;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableModule, NgTemplateOutlet],
})
export class DataTable {
  columns        = input<TableColumn[]>([]);
  data           = input<unknown[]>([]);
  loading        = input(false);
  emptyMessage   = input('No hay datos para mostrar');
  trackByKey     = input('id');
  actionTemplate = input<TemplateRef<unknown> | null>(null);
}
