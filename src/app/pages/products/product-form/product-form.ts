import { Component, computed, effect, ElementRef, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Product, CatalogItem } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products';
import { BrandService } from '../../../core/services/brand';
import { CategoryService } from '../../../core/services/category';
import { UnitService } from '../../../core/services/unit';
import { Toaster } from '../../../core/services/toast';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  imports: [FormsModule, Button, Select, InputText, InputNumber, InputGroup, InputGroupAddon, ToggleSwitch, AppModal],
})
export class ProductForm {
  private readonly productsSvc = inject(ProductsService);
  private readonly brandSvc    = inject(BrandService);
  private readonly categorySvc = inject(CategoryService);
  private readonly unitSvc     = inject(UnitService);
  private readonly toaster     = inject(Toaster);

  editing = input<Product | 'new' | 'new-service' | null>(null);
  closed  = output<void>();
  saved   = output<Product>();

  readonly visible = computed(() => this.editing() !== null);

  fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // ── Form state (signals puros, sin zone.js) ──────────────────────────────
  readonly descripcion  = signal('');
  readonly sku          = signal('');
  readonly tipoMoneda   = signal(1);
  readonly precioPub    = signal(0);
  readonly precioMay    = signal(0);
  readonly costo        = signal(0);
  readonly peso         = signal(0);
  readonly esServicio   = signal(false);
  readonly stAfecto     = signal(true);
  readonly stDesc       = signal(false);
  readonly marcaId      = signal<string | null>(null);
  readonly categoriaId  = signal<string | null>(null);
  readonly unidadId     = signal<string | null>(null);

  // ── Imagen ───────────────────────────────────────────────────────────────
  readonly serverImageUrl  = signal<string | null>(null);
  readonly localPreviewUrl = signal<string | null>(null);
  readonly selectedFile    = signal<File | null>(null);
  readonly imageRemoved    = signal(false);
  readonly currentImageSrc = computed(() => this.localPreviewUrl() || this.serverImageUrl());

  // ── Computeds ────────────────────────────────────────────────────────────
  readonly editingProduct = computed(() => {
    const e = this.editing();
    return (e && e !== 'new' && e !== 'new-service') ? e as Product : null;
  });

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    if (e === 'new')         return 'Nuevo producto';
    if (e === 'new-service') return 'Nuevo servicio';
    return `Editar · ${(e as Product).descripcion}`;
  });

  readonly monedaOptions = [
    { label: 'S/ Soles (PEN)',  value: 1 },
    { label: '$ Dólares (USD)', value: 2 },
  ];

  // ── Catálogos ─────────────────────────────────────────────────────────────
  readonly marcas     = signal<CatalogItem[]>([]);
  readonly categorias = signal<CatalogItem[]>([]);
  readonly unidades   = signal<CatalogItem[]>([]);
  private catalogsLoaded = false;

  readonly filterMarca     = signal('');
  readonly filterCategoria = signal('');
  readonly filterUnidad    = signal('');
  readonly nuevaUnidadSiglas = signal('');

  readonly guardandoMarca     = signal(false);
  readonly guardandoCategoria = signal(false);
  readonly guardandoUnidad    = signal(false);

  readonly labelAgregarMarca = computed(() =>
    this.filterMarca().trim() ? `Agregar "${this.filterMarca().trim()}"` : 'Agregar marca'
  );
  readonly labelAgregarCategoria = computed(() =>
    this.filterCategoria().trim() ? `Agregar "${this.filterCategoria().trim()}"` : 'Agregar categoría'
  );
  readonly labelAgregarUnidad = computed(() =>
    this.filterUnidad().trim() ? `Agregar "${this.filterUnidad().trim()}"` : 'Agregar unidad'
  );

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;

      if (!this.catalogsLoaded) this.loadCatalogs();

      const prev = untracked(() => this.localPreviewUrl());
      if (prev) URL.revokeObjectURL(prev);
      this.localPreviewUrl.set(null);
      this.selectedFile.set(null);
      this.imageRemoved.set(false);
      this.nuevaUnidadSiglas.set('');

      if (e === 'new' || e === 'new-service') {
        this.serverImageUrl.set(null);
        this.descripcion.set('');
        this.sku.set('');
        this.tipoMoneda.set(1);
        this.precioPub.set(0);
        this.precioMay.set(0);
        this.costo.set(0);
        this.peso.set(0);
        this.esServicio.set(e === 'new-service');
        this.stAfecto.set(true);
        this.stDesc.set(false);
        this.marcaId.set(null);
        this.categoriaId.set(null);
        this.unidadId.set(null);
      } else {
        const p = e as Product;
        this.serverImageUrl.set(p.imagenUrl);
        this.descripcion.set(p.descripcion);
        this.sku.set(p.sku);
        this.tipoMoneda.set(p.tipoMoneda);
        this.precioPub.set(p.precioPublico);
        this.precioMay.set(p.precioMayor);
        this.costo.set(p.costo);
        this.peso.set(p.peso ?? 0);
        this.esServicio.set(p.marcaId === null);
        this.stAfecto.set(p.stAfecto === 1);
        this.stDesc.set(p.stDesc === 1);
        this.marcaId.set(p.marcaId);
        this.categoriaId.set(p.categoriaId);
        this.unidadId.set(p.unidadId);
      }
    });
  }

  // ── Catálogos ─────────────────────────────────────────────────────────────

  private loadCatalogs() {
    this.catalogsLoaded = true;
    this.brandSvc.getAll().subscribe({
      next:  res => this.marcas.set(res.data.filter(b => b.estado === 1).map(b => ({ id: b.id, descripcion: b.descripcion }))),
      error: ()  => this.toaster.error('Error', 'No se pudieron cargar las marcas'),
    });
    this.categorySvc.getAll().subscribe({
      next:  res => this.categorias.set(res.data.filter(c => c.estado === 1).map(c => ({ id: c.id, descripcion: c.descripcion }))),
      error: ()  => this.toaster.error('Error', 'No se pudieron cargar las categorías'),
    });
    this.unitSvc.getAll().subscribe({
      next:  res => this.unidades.set(res.data.map(u => ({ id: u.id, descripcion: `${u.descripcion} (${u.siglas})` }))),
      error: ()  => this.toaster.error('Error', 'No se pudieron cargar las unidades'),
    });
  }

  onFilterMarca(e: { filter: string })     { this.filterMarca.set(e.filter ?? ''); }
  onFilterCategoria(e: { filter: string }) { this.filterCategoria.set(e.filter ?? ''); }
  onFilterUnidad(e: { filter: string })    { this.filterUnidad.set(e.filter ?? ''); }

  agregarMarca() {
    const descripcion = this.filterMarca().trim();
    if (!descripcion) return;
    this.guardandoMarca.set(true);
    this.brandSvc.create(descripcion).subscribe({
      next: brand => {
        this.marcas.update(list => [{ id: brand.id, descripcion: brand.descripcion }, ...list]);
        this.marcaId.set(brand.id);
        this.filterMarca.set('');
        this.guardandoMarca.set(false);
        this.toaster.success('Marca creada', `"${brand.descripcion}" agregada correctamente`);
      },
      error: () => {
        this.toaster.error('Error', 'No se pudo crear la marca. Verificá que no exista una igual.');
        this.guardandoMarca.set(false);
      },
    });
  }

  agregarCategoria() {
    const descripcion = this.filterCategoria().trim();
    if (!descripcion) return;
    this.guardandoCategoria.set(true);
    this.categorySvc.create(descripcion).subscribe({
      next: cat => {
        this.categorias.update(list => [{ id: cat.id, descripcion: cat.descripcion }, ...list]);
        this.categoriaId.set(cat.id);
        this.filterCategoria.set('');
        this.guardandoCategoria.set(false);
        this.toaster.success('Categoría creada', `"${cat.descripcion}" agregada correctamente`);
      },
      error: () => {
        this.toaster.error('Error', 'No se pudo crear la categoría. Verificá que no exista una igual.');
        this.guardandoCategoria.set(false);
      },
    });
  }

  agregarUnidad() {
    const descripcion = this.filterUnidad().trim();
    const siglas      = this.nuevaUnidadSiglas().trim().toUpperCase();
    if (!descripcion || !siglas) return;
    this.guardandoUnidad.set(true);
    this.unitSvc.create({ descripcion, siglas }).subscribe({
      next: unit => {
        this.unidades.update(list => [{ id: unit.id, descripcion: `${unit.descripcion} (${unit.siglas})` }, ...list]);
        this.unidadId.set(unit.id);
        this.filterUnidad.set('');
        this.nuevaUnidadSiglas.set('');
        this.guardandoUnidad.set(false);
        this.toaster.success('Unidad creada', `"${unit.descripcion}" (${unit.siglas}) agregada correctamente`);
      },
      error: () => {
        this.toaster.error('Error', 'No se pudo crear la unidad. Verificá que las siglas no existan.');
        this.guardandoUnidad.set(false);
      },
    });
  }

  // ── Imagen ───────────────────────────────────────────────────────────────

  triggerFileInput() {
    this.fileInputRef()?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const prev = this.localPreviewUrl();
    if (prev) URL.revokeObjectURL(prev);
    this.selectedFile.set(file);
    this.localPreviewUrl.set(URL.createObjectURL(file));
    this.serverImageUrl.set(null);
    this.imageRemoved.set(false);
  }

  removeImage() {
    const prev = this.localPreviewUrl();
    if (prev) URL.revokeObjectURL(prev);
    this.localPreviewUrl.set(null);
    this.selectedFile.set(null);
    this.serverImageUrl.set(null);
    this.imageRemoved.set(true);
    const input = this.fileInputRef()?.nativeElement;
    if (input) input.value = '';
  }

  // ── SKU ──────────────────────────────────────────────────────────────────

  generarSku() {
    const catId   = this.categoriaId();
    const catItem = this.categorias().find(c => c.id === catId);
    const prefix  = catItem ? catItem.descripcion.substring(0, 3).toUpperCase() : 'PRD';
    const num     = Math.floor(Math.random() * 900 + 100);
    this.sku.set(`${prefix}-${num}`);
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  save() {
    const src = this.editingProduct();

    const fd = new FormData();
    fd.append('sku',            this.sku());
    fd.append('descripcion',    this.descripcion());
    fd.append('precio_publico', String(this.precioPub()));
    fd.append('precio_mayor',   String(this.precioMay()));
    fd.append('costo',          String(this.costo()));
    fd.append('tipo_moneda',    String(this.tipoMoneda()));
    fd.append('st_afecto',      String(this.stAfecto() ? 1 : 0));
    fd.append('st_desc',        String(this.stDesc()   ? 1 : 0));

    if (!this.esServicio()) {
      const marcaId    = this.marcaId();
      const categoriaId = this.categoriaId();
      const unidadId   = this.unidadId();
      if (marcaId)     fd.append('marca_id_marca',         marcaId);
      if (categoriaId) fd.append('categoria_id_categoria', categoriaId);
      if (unidadId)    fd.append('unidad_id_unidad',       unidadId);
      if (this.peso()) fd.append('peso',                   String(this.peso()));
    }

    const file = this.selectedFile();
    if (file) {
      fd.append('imagen', file);
    } else if (src && this.imageRemoved()) {
      fd.append('removeImagen', 'true');
    }

    const obs = src
      ? this.productsSvc.update(src.id, fd)
      : this.productsSvc.create(fd);

    obs.subscribe({
      next:  product => { this.saved.emit(product); this.closed.emit(); },
      error: ()      => this.toaster.error('Error', 'No se pudo guardar el producto'),
    });
  }

  close() { this.closed.emit(); }
}
