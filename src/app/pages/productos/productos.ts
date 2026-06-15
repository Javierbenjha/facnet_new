import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { AppModal } from '../../shared/app-modal/app-modal';

export interface Producto {
  id: string;
  sku: string;
  name: string;
  cat: string;
  price: number;
  cost: number;
  stock: number;
  unit: string;
}

const THUMB_COLORS = [
  { bg: 'oklch(0.92 0.04 265)', fg: 'oklch(0.45 0.12 265)' },
  { bg: 'oklch(0.93 0.05 155)', fg: 'oklch(0.42 0.1 155)' },
  { bg: 'oklch(0.94 0.05 70)',  fg: 'oklch(0.5 0.12 70)' },
  { bg: 'oklch(0.93 0.05 25)',  fg: 'oklch(0.5 0.14 25)' },
  { bg: 'oklch(0.93 0.04 320)', fg: 'oklch(0.45 0.12 320)' },
  { bg: 'oklch(0.93 0.05 200)', fg: 'oklch(0.45 0.12 200)' },
];

const PRODUCTS: Producto[] = [
  { id: 'p01', sku: 'BEB-001', name: 'Agua mineral 500ml',      cat: 'Bebidas',    price: 4.50,  cost: 2.10,  stock: 184, unit: 'und' },
  { id: 'p02', sku: 'BEB-007', name: 'Jugo natural de naranja', cat: 'Bebidas',    price: 12.00, cost: 6.20,  stock: 42,  unit: 'und' },
  { id: 'p03', sku: 'CAF-012', name: 'Espresso doble',          cat: 'Café',       price: 9.50,  cost: 2.80,  stock: 999, unit: 'und' },
  { id: 'p04', sku: 'CAF-014', name: 'Latte vainilla',          cat: 'Café',       price: 14.00, cost: 4.30,  stock: 999, unit: 'und' },
  { id: 'p05', sku: 'CAF-016', name: 'Cold brew 12oz',          cat: 'Café',       price: 16.50, cost: 5.10,  stock: 999, unit: 'und' },
  { id: 'p06', sku: 'PAN-003', name: 'Croissant mantequilla',   cat: 'Panadería',  price: 7.50,  cost: 2.20,  stock: 38,  unit: 'und' },
  { id: 'p07', sku: 'PAN-009', name: 'Pan de chocolate',        cat: 'Panadería',  price: 8.00,  cost: 2.60,  stock: 24,  unit: 'und' },
  { id: 'p08', sku: 'PAN-011', name: 'Sandwich pavo',           cat: 'Panadería',  price: 18.00, cost: 7.40,  stock: 16,  unit: 'und' },
  { id: 'p09', sku: 'SNK-021', name: 'Barra granola artesanal', cat: 'Snacks',     price: 6.00,  cost: 2.00,  stock: 74,  unit: 'und' },
  { id: 'p10', sku: 'SNK-028', name: 'Mix frutos secos',        cat: 'Snacks',     price: 11.00, cost: 4.50,  stock: 52,  unit: 'und' },
  { id: 'p11', sku: 'LAC-004', name: 'Yogurt griego',           cat: 'Lácteos',    price: 9.00,  cost: 3.80,  stock: 28,  unit: 'und' },
  { id: 'p12', sku: 'LAC-006', name: 'Leche de almendras',      cat: 'Lácteos',    price: 13.50, cost: 5.60,  stock: 9,   unit: 'und' },
  { id: 'p13', sku: 'ACC-002', name: 'Taza cerámica branded',   cat: 'Accesorios', price: 29.00, cost: 11.00, stock: 33,  unit: 'und' },
  { id: 'p14', sku: 'ACC-005', name: 'Termo 500ml',             cat: 'Accesorios', price: 49.00, cost: 22.00, stock: 18,  unit: 'und' },
  { id: 'p15', sku: 'CAF-021', name: 'Bolsa café grano 250g',   cat: 'Café',       price: 38.00, cost: 14.00, stock: 62,  unit: 'und' },
  { id: 'p16', sku: 'BEB-015', name: 'Limonada de maracuyá',    cat: 'Bebidas',    price: 10.50, cost: 3.70,  stock: 40,  unit: 'und' },
];

const CATEGORIES = ['Todas', 'Bebidas', 'Panadería', 'Snacks', 'Lácteos', 'Café', 'Accesorios'];

const BRANCHES = [
  { id: 'b1', name: 'Miraflores',       city: 'Lima' },
  { id: 'b2', name: 'San Isidro',       city: 'Lima' },
  { id: 'b3', name: 'Arequipa Centro',  city: 'Arequipa' },
];

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, Button, Select, AppModal],
})
export class Productos {
  private readonly fb = inject(FormBuilder);

  // ─── Estado ────────────────────────────────────────────────────────────────
  readonly query    = signal('');
  readonly cat      = signal('Todas');
  readonly status   = signal<'todos' | 'ok' | 'bajo'>('todos');
  readonly editing  = signal<Producto | 'new' | null>(null);
  readonly selected = signal(new Set<string>());
  readonly currentPage = signal(1);
  readonly pageSize    = signal(8);
  readonly activeMenu  = signal<string | null>(null);

  // ─── Datos ─────────────────────────────────────────────────────────────────
  readonly products   = signal<Producto[]>(PRODUCTS);
  readonly categories = CATEGORIES;
  readonly branches   = BRANCHES;
  readonly catOptions = CATEGORIES.map(c => ({ label: c, value: c }));
  readonly unitOptions = [
    { label: 'und', value: 'und' },
    { label: 'kg',  value: 'kg' },
    { label: 'lt',  value: 'lt' },
    { label: 'caja', value: 'caja' },
  ];

  // ─── Computed ──────────────────────────────────────────────────────────────
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

  readonly totalItems = computed(() => this.filteredProducts().length);

  readonly paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  );

  readonly kpis = computed(() => {
    const ps = this.products();
    const valorInventario = ps.reduce(
      (s, p) => s + p.cost * (p.stock === 999 ? 50 : p.stock), 0
    );
    const stockBajo = ps.filter(p => p.stock < 30 && p.stock !== 999).length;
    return {
      total: ps.length,
      valorInventario,
      stockBajo,
      margen: '62.4%',
    };
  });

  readonly showModal = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nuevo producto' : `Editar · ${(e as Producto).name}`;
  });

  // ─── Formulario ─────────────────────────────────────────────────────────────
  readonly form = this.fb.nonNullable.group({
    name:        [''],
    sku:         [''],
    cat:         [''],
    description: [''],
    price:       [0],
    cost:        [0],
    unit:        ['und'],
    igv:         ['18'],
    stockMin:    [30],
  });

  // ─── Helpers ────────────────────────────────────────────────────────────────
  thumb(i: number) { return THUMB_COLORS[i % THUMB_COLORS.length]; }

  skuPrefix(sku: string) { return sku.split('-')[0]; }

  margin(p: Producto) { return ((p.price - p.cost) / p.price * 100); }

  stockBadge(p: Producto): string {
    if (p.stock === 999) return '';
    if (p.stock < 15) return 'badge-danger';
    if (p.stock < 30) return 'badge-warn';
    return 'badge-success';
  }

  fmtCurrency(n: number) {
    return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  fmtInt(n: number) { return n.toLocaleString('es-PE'); }

  branchStock(p: Producto | null, i: number) {
    if (!p) return 0;
    return Math.max(0, (p.stock === 999 ? 50 : p.stock) - i * 5);
  }

  showingStart() { return (this.currentPage() - 1) * this.pageSize() + 1; }
  showingEnd()   {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  }

  // ─── Acciones ───────────────────────────────────────────────────────────────
  openNew() {
    this.form.reset({ name: '', sku: '', cat: 'Café', description: '', price: 0, cost: 0, unit: 'und', igv: '18', stockMin: 30 });
    this.editing.set('new');
  }

  openEdit(p: Producto) {
    this.form.patchValue({ name: p.name, sku: p.sku, cat: p.cat, description: '', price: p.price, cost: p.cost, unit: p.unit, igv: '18', stockMin: 30 });
    this.editing.set(p);
    this.activeMenu.set(null);
  }

  closeModal() { this.editing.set(null); }

  toggle(id: string) {
    this.selected.update(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    this.activeMenu.update(cur => cur === id ? null : id);
  }

  closeMenu() { this.activeMenu.set(null); }

  goPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) this.currentPage.set(p);
  }

  onCatChange(v: string) { this.cat.set(v); this.currentPage.set(1); }
  onQueryChange(v: string) { this.query.set(v); this.currentPage.set(1); }
  onStatusChange(v: 'todos' | 'ok' | 'bajo') { this.status.set(v); this.currentPage.set(1); }
}
