import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
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
  imports: [FormsModule, TableModule, Button, Select, SelectButton, InputText, IconField, InputIcon, Tag, Menu],
})
export class ProductsTable {
  products    = input<Producto[]>([]);
  editProduct = output<Producto>();

  readonly query  = signal('');
  readonly cat    = signal('Todas');
  readonly status = signal<'todos' | 'ok' | 'bajo'>('todos');

  selectedProducts: Producto[] = [];

  readonly categories = CATEGORIES.map(c => ({ label: c, value: c }));

  readonly statusOptions = [
    { label: 'Todos',      value: 'todos' },
    { label: 'En stock',   value: 'ok'    },
    { label: 'Stock bajo', value: 'bajo'  },
  ];

  readonly filteredProducts = computed(() => {
    const q = this.query().toLowerCase().trim();
    const c = this.cat();
    const s = this.status();
    return this.products().filter(p =>
      (c === 'Todas' || p.cat === c) &&
      (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (s === 'todos' ||
       (s === 'bajo' && p.stock < 30 && p.stock !== 999) ||
       (s === 'ok'   && (p.stock >= 30 || p.stock === 999)))
    );
  });

  thumb(i: number)       { return THUMB_COLORS[i % THUMB_COLORS.length]; }
  skuPrefix(sku: string) { return sku.split('-')[0]; }
  margin(p: Producto)    { return (p.price - p.cost) / p.price * 100; }

  stockSeverity(p: Producto): 'success' | 'warn' | 'danger' | 'secondary' {
    if (p.stock === 999) return 'secondary';
    if (p.stock < 15)    return 'danger';
    if (p.stock < 30)    return 'warn';
    return 'success';
  }

  getMenuItems(p: Producto) {
    return [
      { label: 'Editar',           icon: 'pi pi-pencil',  command: () => this.editProduct.emit(p) },
      { label: 'Ver por sucursal', icon: 'pi pi-building' },
      { separator: true },
      { label: 'Eliminar',         icon: 'pi pi-trash',   styleClass: 'text-red-500' },
    ];
  }

  onQueryChange(v: string)                    { this.query.set(v);  }
  onCatChange(v: string)                      { this.cat.set(v);    }
  onStatusChange(v: 'todos' | 'ok' | 'bajo') { this.status.set(v); }
}
