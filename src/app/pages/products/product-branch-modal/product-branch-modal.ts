import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tag } from 'primeng/tag';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Product } from '../../../core/models/product.model';
import { Branch } from '../../../core/services/branch';
import { ProductsService } from '../../../core/services/products';
import { Toaster } from '../../../core/services/toast';

interface BranchRow {
  id: string;
  descripcion: string;
  estadoBranch: number;
  productoActivo: boolean;
  stockMin: number;
  saving: boolean;
  toggling: boolean;
}

@Component({
  selector: 'app-product-branch-modal',
  templateUrl: './product-branch-modal.html',
  imports: [FormsModule, Button, InputNumber, ToggleSwitch, Tag, AppModal],
})
export class ProductBranchModal {
  private readonly branchSvc = inject(Branch);
  private readonly svc       = inject(ProductsService);
  private readonly toaster   = inject(Toaster);

  editing = input<Product | null>(null);
  closed  = output<void>();
  saved   = output<Product>();

  readonly visible  = computed(() => this.editing() !== null);
  readonly loading  = signal(false);
  readonly rows     = signal<BranchRow[]>([]);

  constructor() {
    effect(() => {
      const p = this.editing();
      if (!p) { this.rows.set([]); return; }
      this.loadBranches();
    });
  }

  private loadBranches() {
    this.loading.set(true);
    this.branchSvc.getBranches().subscribe({
      next: branches => {
        this.rows.set(branches.map(b => ({
          id:             b.id,
          descripcion:    b.descripcion,
          estadoBranch:   b.estado,
          productoActivo: true,   // TODO: viene de GET /products/:id/branches
          stockMin:       this.editing()?.stockMin ?? 0, // TODO: por sucursal
          saving:   false,
          toggling: false,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toaster.error('Error', 'No se pudieron cargar las sucursales');
      },
    });
  }

  toggleRow(row: BranchRow) {
    // TODO: POST /products/:id/branches/:branchId/toggle
    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, productoActivo: !r.productoActivo } : r)
    );
  }

  saveRow(row: BranchRow) {
    const p = this.editing();
    if (!p) return;

    // TODO: PATCH /products/:id/branches/:branchId/stock-min
    // Por ahora usa el endpoint de sucursal activa si coincide
    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, saving: true } : r)
    );
    this.svc.updateStockMin(p.id, row.stockMin).subscribe({
      next: res => {
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, saving: false } : r)
        );
        this.saved.emit({ ...p, stockMin: res.stockMin });
        this.toaster.success('Stock mínimo actualizado', `Stock mínimo: ${res.stockMin}`);
      },
      error: () => {
        this.rows.update(list =>
          list.map(r => r.id === row.id ? { ...r, saving: false } : r)
        );
        this.toaster.error('Error', 'No se pudo actualizar el stock mínimo');
      },
    });
  }

  updateStockMin(row: BranchRow, value: number) {
    this.rows.update(list =>
      list.map(r => r.id === row.id ? { ...r, stockMin: value } : r)
    );
  }

  close() { this.closed.emit(); }
}
