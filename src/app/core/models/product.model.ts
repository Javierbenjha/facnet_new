export interface Product {
  id: string;
  sku: string;
  descripcion: string;
  precioPublico: number;
  precioMayor: number;
  costo: number;
  peso: number | null;
  tipoMoneda: number;
  stAfecto: number;
  stDesc: number;
  marcaId: string | null;
  marca: string | null;
  categoriaId: string | null;
  categoria: string | null;
  unidadId: string | null;
  unidad: string | null;
  imagenUrl: string | null;
  estado: number;           // 1 = activo, 2 = inactivo
  fechaAdi: string;
  fechaMod: string | null;
  stock?: number;
  stockMin?: number;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  marcaId?: string;
  categoriaId?: string;
}

export interface CatalogItem {
  id: string;
  descripcion: string;
}

export interface Brand {
  id: string;
  descripcion: string;
  estado: number;
  fecha_adi: string;
  fecha_mod: string | null;
}

export type Category = Brand;

export interface Unit {
  id: string;
  descripcion: string;
  siglas: string;
  created_at: string;
  updated_at: string;
}

export interface CatalogListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
