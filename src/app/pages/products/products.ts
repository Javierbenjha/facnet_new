import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products';
import { Toaster } from '../../core/services/toast';
import { ProductsTable } from './products-table/products-table';
import { ProductForm } from './product-form/product-form';
import { ProductBranchModal } from './product-branch-modal/product-branch-modal';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  imports: [FormsModule, Button, SelectButton, Menu, ProductsTable, ProductForm, ProductBranchModal, PageHeader, KpiCard],
})
export class Products implements OnInit {
  private readonly svc     = inject(ProductsService);
  private readonly toaster = inject(Toaster);

  readonly products        = signal<Product[]>([]);
  readonly loading         = signal(false);
  readonly editing         = signal<Product | 'new' | 'new-service' | null>(null);
  readonly editingBranch   = signal<Product | null>(null);
  readonly tipo            = signal<'productos' | 'servicios'>('productos');

  readonly tipoOptions = [
    { label: 'Productos', value: 'productos' },
    { label: 'Servicios', value: 'servicios' },
  ];

  readonly kpis = computed(() => {
    const ps = this.products().filter(p =>
      this.tipo() === 'productos' ? p.marcaId !== null : p.marcaId === null
    );
    return {
      total:           ps.length,
      activos:         ps.filter(p => p.estado === 1).length,
      inactivos:       ps.filter(p => p.estado === 2).length,
      valorInventario: ps.reduce((s, p) => s + p.costo * (p.stock ?? 0), 0),
    };
  });

  readonly toolItems: MenuItem[] = [
    { label: 'Agregar Categoría',       icon: 'pi pi-tag'     },
    { label: 'Agregar Marca',           icon: 'pi pi-verified' },
    { separator: true },
    { label: 'Regularización de Stock', icon: 'pi pi-refresh'  },
  ];

  ngOnInit() { this.loadProducts(); }

  fmtCurrency(n: number) {
    return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  exportExcel() { /* TODO: implementar exportación */ }

  openNew()                      { this.editing.set(this.tipo() === 'servicios' ? 'new-service' : 'new'); }
  openEdit(p: Product)           { this.editing.set(p); }
  closeModal()                   { this.editing.set(null); }
  openBranchModal(p: Product)    { this.editingBranch.set(p); }
  closeBranchModal()             { this.editingBranch.set(null); }

  onProductSaved(p: Product) {
    this.products.update(list => {
      const idx = list.findIndex(x => x.id === p.id);
      return idx === -1 ? [p, ...list] : list.map(x => x.id === p.id ? p : x);
    });
  }

  onToggleEstado(p: Product) {
    this.svc.toggleEstado(p.id).subscribe({
      next: res => {
        this.products.update(list =>
          list.map(x => x.id === p.id ? res.producto : x)
        );
        const label = res.producto.estado === 1 ? 'activado' : 'desactivado';
        this.toaster.success('Producto', `Producto ${label} con éxito.`);
      },
      error: () => this.toaster.error('Error', 'No se pudo cambiar el estado del producto'),
    });
  }

  private loadProducts() {
    this.loading.set(true);
    this.svc.getAll({ limit: 200 }).subscribe({
      next:  res => { this.products.set(res.data); this.loading.set(false); },
      error: ()  => { this.toaster.error('Error', 'No se pudieron cargar los productos'); this.loading.set(false); },
    });
  }

}
