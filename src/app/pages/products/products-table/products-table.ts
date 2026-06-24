import { Component, computed, debounced, effect, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../core/models/product.model';
import { siglaMoneda } from '../products.models';
import { DataTable, TableColumn } from '../../../shared/data-table/data-table';
import { TablePagination } from '../../../shared/table-pagination/table-pagination';

const THUMB_COLORS = [
  { bg: 'oklch(0.92 0.04 265)', fg: 'oklch(0.45 0.12 265)' },
  { bg: 'oklch(0.93 0.05 155)', fg: 'oklch(0.42 0.1 155)'  },
  { bg: 'oklch(0.94 0.05 70)',  fg: 'oklch(0.5 0.12 70)'   },
  { bg: 'oklch(0.93 0.05 25)',  fg: 'oklch(0.5 0.14 25)'   },
  { bg: 'oklch(0.93 0.04 320)', fg: 'oklch(0.45 0.12 320)' },
  { bg: 'oklch(0.93 0.05 200)', fg: 'oklch(0.45 0.12 200)' },
];

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.html',
  styleUrl: './products-table.scss',
  imports: [FormsModule, Button, Select, SelectButton, InputText, IconField, InputIcon, Tag, Menu, DataTable, TablePagination],
})
export class ProductsTable {
  products     = input<Product[]>([]);
  tipo         = input<'productos' | 'servicios'>('productos');
  loading      = input(false);
  editProduct      = output<Product>();
  toggleEstado     = output<Product>();
  gestionarSucursal = output<Product>();

  readonly query          = signal('');
  readonly debouncedQuery = debounced(this.query, 300);
  readonly cat            = signal('');
  readonly status         = signal<'todos' | 'activos' | 'inactivos'>('todos');
  readonly view           = signal<'table' | 'grid'>('table');
  readonly gridPage       = signal(1);
  readonly gridPageSize   = signal(8);

  private readonly productoCellTpl  = viewChild.required<TemplateRef<unknown>>('productoCellTpl');
  private readonly skuCellTpl       = viewChild.required<TemplateRef<unknown>>('skuCellTpl');
  private readonly categoriaCellTpl = viewChild.required<TemplateRef<unknown>>('categoriaCellTpl');
  private readonly marcaCellTpl     = viewChild.required<TemplateRef<unknown>>('marcaCellTpl');
  private readonly unidadCellTpl    = viewChild.required<TemplateRef<unknown>>('unidadCellTpl');
  private readonly costoCellTpl     = viewChild.required<TemplateRef<unknown>>('costoCellTpl');
  private readonly precioPubCellTpl = viewChild.required<TemplateRef<unknown>>('precioPubCellTpl');
  private readonly precioMayCellTpl = viewChild.required<TemplateRef<unknown>>('precioMayCellTpl');
  private readonly estadoCellTpl    = viewChild.required<TemplateRef<unknown>>('estadoCellTpl');
  private readonly stockCellTpl     = viewChild.required<TemplateRef<unknown>>('stockCellTpl');
  private readonly stockMinCellTpl  = viewChild.required<TemplateRef<unknown>>('stockMinCellTpl');
  private readonly actionCellTpl    = viewChild.required<TemplateRef<unknown>>('actionCellTpl');

  constructor() {
    effect(() => {
      this.filteredProducts();
      this.gridPage.set(1);
    }, { allowSignalWrites: true });
  }

  readonly categoryOptions = computed(() => {
    const cats = [...new Set(
      this.products()
        .filter(p => p.categoria)
        .map(p => p.categoria!)
    )].sort();
    return [
      { label: 'Todas', value: '' },
      ...cats.map(c => ({ label: c, value: c })),
    ];
  });

  readonly statusOptions = [
    { label: 'Todos',     value: 'todos'     },
    { label: 'Activos',   value: 'activos'   },
    { label: 'Inactivos', value: 'inactivos' },
  ];

  readonly filteredProducts = computed(() => {
    const q = (this.debouncedQuery.value() ?? '').toLowerCase().trim();
    const c = this.cat();
    const s = this.status();
    const t = this.tipo();
    return this.products().filter(p =>
      (t === 'productos' ? p.marcaId !== null : p.marcaId === null) &&
      (t === 'servicios' || !c || p.categoria === c) &&
      (!q || p.descripcion.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (s === 'todos' ||
       (s === 'activos'   && p.estado === 1) ||
       (s === 'inactivos' && p.estado === 2))
    );
  });

  readonly pagedGridProducts = computed(() => {
    const start = (this.gridPage() - 1) * this.gridPageSize();
    return this.filteredProducts().slice(start, start + this.gridPageSize());
  });

  readonly tableColumns = computed<TableColumn[]>(() => {
    const t = this.tipo();
    const cols: TableColumn[] = [
      { key: 'descripcion', label: t === 'productos' ? 'Producto' : 'Servicio', cellTemplate: this.productoCellTpl() },
      { key: 'sku',         label: 'SKU',                                        cellTemplate: this.skuCellTpl() },
    ];
    if (t === 'productos') {
      cols.push(
        { key: 'categoria', label: 'Categoría', cellTemplate: this.categoriaCellTpl() },
        { key: 'marca',     label: 'Marca',     cellTemplate: this.marcaCellTpl() },
        { key: 'unidad',    label: 'Unidad',    cellTemplate: this.unidadCellTpl() },
      );
    }
    cols.push(
      { key: 'costo',         label: 'Costo',      class: 'text-right', cellTemplate: this.costoCellTpl() },
      { key: 'precioPublico', label: 'P. Público', class: 'text-right', cellTemplate: this.precioPubCellTpl() },
      { key: 'precioMayor',   label: 'P. Mayor',   class: 'text-right', cellTemplate: this.precioMayCellTpl() },
      { key: 'estado',        label: 'Estado',                           cellTemplate: this.estadoCellTpl() },
    );
    if (t === 'productos') {
      cols.push(
        { key: 'stock',    label: 'Stock',      cellTemplate: this.stockCellTpl() },
        { key: 'stockMin', label: 'Stock Mín.', class: 'text-right', cellTemplate: this.stockMinCellTpl() },
      );
    }
    cols.push({ key: '_actions', label: '', class: 'w-16', cellTemplate: this.actionCellTpl() });
    return cols;
  });

  thumb(i: number)       { return THUMB_COLORS[i % THUMB_COLORS.length]; }
  skuPrefix(sku: string) { return sku.split('-')[0]; }
  sigla(p: Product)      { return siglaMoneda(p.tipoMoneda); }

  stockSeverity(p: Product): 'success' | 'warn' | 'danger' | 'secondary' {
    const stock = p.stock;
    if (stock == null) return 'secondary';
    if (stock <= 0)    return 'danger';
    if (stock < (p.stockMin ?? 0)) return 'warn';
    return 'success';
  }

  readonly rowMenuItems = signal<MenuItem[]>([]);

  openRowMenu(event: Event, p: Product, menu: Menu) {
    const isActive = p.estado === 1;
    this.rowMenuItems.set([
      { label: 'Editar',                            icon: 'pi pi-pencil',       command: () => this.editProduct.emit(p) },
      { label: isActive ? 'Desactivar' : 'Activar', icon: isActive ? 'pi pi-times-circle' : 'pi pi-check-circle',
        command: () => this.toggleEstado.emit(p) },
      { separator: true },
      { label: 'Gestionar por Sucursal', icon: 'pi pi-building', command: () => this.gestionarSucursal.emit(p) },
      { label: 'Ver movimientos',        icon: 'pi pi-chart-bar' },
      { label: 'Historial de compras',   icon: 'pi pi-history'   },
    ]);
    menu.toggle(event);
  }

  onQueryChange(v: string)                              { this.query.set(v);  }
  onCatChange(v: string)                                { this.cat.set(v);    }
  onStatusChange(v: 'todos' | 'activos' | 'inactivos') { this.status.set(v); }
  onViewChange(v: 'table' | 'grid')                    { this.view.set(v);   }
  onGridPageChange(page: number)                        { this.gridPage.set(page); }
  onGridPageSizeChange(size: number)                    { this.gridPageSize.set(size); }
}
