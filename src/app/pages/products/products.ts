import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { PRODUCTS, Producto } from './products.models';
import { ProductsTable } from './products-table/products-table';
import { ProductForm } from './product-form/product-form';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ProductsTable, ProductForm],
})
export class Products {
  readonly products = signal<Producto[]>(PRODUCTS);
  readonly editing  = signal<Producto | 'new' | null>(null);

  readonly kpis = computed(() => {
    const ps = this.products();
    return {
      total:           ps.length,
      valorInventario: ps.reduce((s, p) => s + p.cost * (p.stock === 999 ? 50 : p.stock), 0),
      stockBajo:       ps.filter(p => p.stock < 30 && p.stock !== 999).length,
      margen:          '62.4%',
    };
  });

  fmtCurrency(n: number) {
    return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  openNew()             { this.editing.set('new'); }
  openEdit(p: Producto) { this.editing.set(p);    }
  closeModal()          { this.editing.set(null);  }
}
