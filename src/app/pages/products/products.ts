import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
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
  imports: [FormsModule, Button, SelectButton, Menu, ProductsTable, ProductForm, PageHeader, KpiCard],
})
export class Products {
  readonly products = signal<Producto[]>(PRODUCTS);
  readonly editing  = signal<Producto | 'new' | 'new-service' | null>(null);
  readonly tipo     = signal<'productos' | 'servicios'>('productos');

  readonly tipoOptions = [
    { label: 'Productos', value: 'productos' },
    { label: 'Servicios', value: 'servicios' },
  ];

  readonly kpis = computed(() => {
    const ps = this.products().filter(p =>
      this.tipo() === 'productos' ? p.st_producto !== 0 : p.st_producto === 0
    );
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

  onProductSaved(p: Producto) {
    const list = this.products();
    if (list.some(x => x.id === p.id)) {
      this.products.set(list.map(x => x.id === p.id ? p : x));
    } else {
      this.products.set([...list, p]);
    }
  }

  openNew()             { this.editing.set(this.tipo() === 'servicios' ? 'new-service' : 'new'); }
  openEdit(p: Producto) { this.editing.set(p);    }
  closeModal()          { this.editing.set(null);  }
}
