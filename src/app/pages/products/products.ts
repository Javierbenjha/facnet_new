import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PRODUCTS, Producto } from './products.models';
import { ProductsTable } from './products-table/products-table';
import { ProductForm } from './product-form/product-form';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Menu, ProductsTable, ProductForm, PageHeader, KpiCard],
})
export class Products {
  readonly products = signal<Producto[]>(PRODUCTS);
  readonly editing  = signal<Producto | 'new' | null>(null);

  readonly kpis = computed(() => {
    const ps = this.products();
    return {
      total:           ps.length,
      activos:         ps.filter(p => p.estado === 'ACTIVO').length,
      inactivos:       ps.filter(p => p.estado === 'INACTIVO').length,
      valorInventario: ps.reduce((s, p) => s + p.costo * (p.stock === 999 ? 50 : p.stock), 0),
    };
  });

  readonly toolItems: MenuItem[] = [
    { label: 'Agregar Categoría',       icon: 'pi pi-tag'    },
    { label: 'Agregar Marca',           icon: 'pi pi-verified' },
    { separator: true },
    { label: 'Regularización de Stock', icon: 'pi pi-refresh' },
  ];

  fmtCurrency(n: number) {
    return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  exportExcel() { /* TODO: implementar exportación */ }

  openNew()             { this.editing.set('new'); }
  openEdit(p: Producto) { this.editing.set(p);    }
  closeModal()          { this.editing.set(null);  }
}
