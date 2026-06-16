import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { Menu } from 'primeng/menu';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { CATEGORIES, Producto } from '../products.models';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TableModule, Button, Select, SelectButton, InputText, IconField, InputIcon, Tag, Menu, Paginator],
})
export class ProductsTable {
  products    = input<Producto[]>([]);
  editProduct = output<Producto>();

  readonly query  = signal('');
  readonly cat    = signal('Todas');
  readonly status = signal<'todos' | 'activos' | 'inactivos'>('todos');
  readonly view      = signal<'table' | 'grid'>('table');
  readonly gridFirst = signal(0);
  readonly gridRows  = signal(8);

  readonly pagedGridProducts = computed(() =>
    this.filteredProducts().slice(this.gridFirst(), this.gridFirst() + this.gridRows())
  );

  constructor() {
    effect(() => {
      this.filteredProducts();
      this.gridFirst.set(0);
    }, { allowSignalWrites: true });
  }

  readonly categories = CATEGORIES.map(c => ({ label: c, value: c }));

  readonly statusOptions = [
    { label: 'Todos',     value: 'todos'     },
    { label: 'Activos',   value: 'activos'   },
    { label: 'Inactivos', value: 'inactivos' },
  ];

  readonly filteredProducts = computed(() => {
    const q = this.query().toLowerCase().trim();
    const c = this.cat();
    const s = this.status();
    return this.products().filter(p =>
      (c === 'Todas' || p.categoria === c) &&
      (!q || p.descripcion.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (s === 'todos' ||
       (s === 'activos'   && p.estado === 'ACTIVO') ||
       (s === 'inactivos' && p.estado === 'INACTIVO'))
    );
  });

  thumb(i: number)       { return THUMB_COLORS[i % THUMB_COLORS.length]; }
  skuPrefix(sku: string) { return sku.split('-')[0]; }

  stockSeverity(p: Producto): 'success' | 'warn' | 'danger' | 'secondary' {
    if (p.stock === 999)        return 'secondary';
    if (p.stock <= 0)           return 'danger';
    if (p.stock < p.stock_min)  return 'warn';
    return 'success';
  }

  getMenuItems(p: Producto) {
    const isActive = p.st_producto === 1;
    return [
      { label: 'Editar',                icon: 'pi pi-pencil',       command: () => this.editProduct.emit(p) },
      { label: isActive ? 'Inactivar' : 'Activar', icon: isActive ? 'pi pi-times-circle' : 'pi pi-check-circle' },
      { separator: true },
      { label: 'Gestionar por Sucursal', icon: 'pi pi-building'    },
      { label: 'Ver movimientos',        icon: 'pi pi-chart-bar'   },
      { label: 'Historial de compras',   icon: 'pi pi-history'     },
    ];
  }

  onQueryChange(v: string)                              { this.query.set(v);  }
  onCatChange(v: string)                                { this.cat.set(v);    }
  onStatusChange(v: 'todos' | 'activos' | 'inactivos') { this.status.set(v); }
  onViewChange(v: 'table' | 'grid')                    { this.view.set(v);   }
  onGridPageChange(e: PaginatorState) { this.gridFirst.set(e.first ?? 0); this.gridRows.set(e.rows ?? 8); }
}
