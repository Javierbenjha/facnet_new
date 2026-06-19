import { Component, TemplateRef, input, output } from '@angular/core';
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
  imports: [TableModule, NgTemplateOutlet],
})
export class DataTable {
  columns            = input<TableColumn[]>([]);
  data               = input<unknown[]>([]);
  loading            = input(false);
  emptyMessage       = input('No hay datos para mostrar');
  trackByKey         = input('id');
  actionTemplate     = input<TemplateRef<unknown> | null>(null);
  paginator          = input(false);
  rows               = input(10);
  rowsPerPageOptions = input<number[]>([8, 16, 32]);
  rowHover           = input(true);
  scrollable         = input(false);

  rowClick = output<unknown>();
}
