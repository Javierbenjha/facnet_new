export interface Producto {
  id:             string;
  sku:            string;
  descripcion:    string;
  categoria:      string;
  precio_publico: number;
  precio_mayor:   number;
  costo:          number;
  marca:          string;
  unidad:         string;
  estado:         'ACTIVO' | 'INACTIVO';
  st_producto:    0 | 1;
  stock:          number;
  stock_min:      number;
  sigla:          string;
  peso?:          number;
  stafecto?:      0 | 1;
  stdesc?:        0 | 1;
}

export const CATEGORIES = ['Todas', 'Bebidas', 'Panadería', 'Snacks', 'Lácteos', 'Café', 'Accesorios'];

export const MARCAS: string[] = ['San Luis', 'Laive', 'Illy', 'Starbucks', 'Laritza', 'Pronto', 'Naturelab', 'Gloria', 'Silk', 'FacNet', 'Klean Kanteen', 'Altomayo', 'Cassinelli'];

export const UNIDADES: string[] = ['und', 'kg', 'lt', 'caja', 'doc', 'paquete', 'par', 'set'];

export const BRANCHES = [
  { id: 'b1', name: 'Miraflores',      city: 'Lima'     },
  { id: 'b2', name: 'San Isidro',      city: 'Lima'     },
  { id: 'b3', name: 'Arequipa Centro', city: 'Arequipa' },
];

export const PRODUCTS: Producto[] = [
  { id: 'p01', sku: 'BEB-001', descripcion: 'Agua mineral 500ml',      categoria: 'Bebidas',    precio_publico:  4.50, precio_mayor:  3.80, costo:  2.10, marca: 'San Luis',   unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock: 184, stock_min: 20, sigla: 'S/' },
  { id: 'p02', sku: 'BEB-007', descripcion: 'Jugo natural de naranja', categoria: 'Bebidas',    precio_publico: 12.00, precio_mayor: 10.00, costo:  6.20, marca: 'Laive',      unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  42, stock_min: 10, sigla: 'S/' },
  { id: 'p03', sku: 'CAF-012', descripcion: 'Espresso doble',          categoria: 'Café',       precio_publico:  9.50, precio_mayor:  8.00, costo:  2.80, marca: 'Illy',       unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock: 999, stock_min:  0, sigla: 'S/' },
  { id: 'p04', sku: 'CAF-014', descripcion: 'Latte vainilla',          categoria: 'Café',       precio_publico: 14.00, precio_mayor: 11.50, costo:  4.30, marca: 'Starbucks',  unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock: 999, stock_min:  0, sigla: 'S/' },
  { id: 'p05', sku: 'CAF-016', descripcion: 'Cold brew 12oz',          categoria: 'Café',       precio_publico: 16.50, precio_mayor: 13.00, costo:  5.10, marca: 'Starbucks',  unidad: 'und', estado: 'INACTIVO', st_producto: 0, stock: 999, stock_min:  0, sigla: 'S/' },
  { id: 'p06', sku: 'PAN-003', descripcion: 'Croissant mantequilla',   categoria: 'Panadería',  precio_publico:  7.50, precio_mayor:  6.00, costo:  2.20, marca: 'Laritza',    unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  38, stock_min: 15, sigla: 'S/' },
  { id: 'p07', sku: 'PAN-009', descripcion: 'Pan de chocolate',        categoria: 'Panadería',  precio_publico:  8.00, precio_mayor:  6.50, costo:  2.60, marca: 'Laritza',    unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  24, stock_min: 15, sigla: 'S/' },
  { id: 'p08', sku: 'PAN-011', descripcion: 'Sandwich pavo',           categoria: 'Panadería',  precio_publico: 18.00, precio_mayor: 15.00, costo:  7.40, marca: 'Pronto',     unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  16, stock_min: 10, sigla: 'S/' },
  { id: 'p09', sku: 'SNK-021', descripcion: 'Barra granola artesanal', categoria: 'Snacks',     precio_publico:  6.00, precio_mayor:  5.00, costo:  2.00, marca: 'Naturelab',  unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  74, stock_min: 20, sigla: 'S/' },
  { id: 'p10', sku: 'SNK-028', descripcion: 'Mix frutos secos',        categoria: 'Snacks',     precio_publico: 11.00, precio_mayor:  9.00, costo:  4.50, marca: 'Naturelab',  unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  52, stock_min: 20, sigla: 'S/' },
  { id: 'p11', sku: 'LAC-004', descripcion: 'Yogurt griego',           categoria: 'Lácteos',    precio_publico:  9.00, precio_mayor:  7.50, costo:  3.80, marca: 'Gloria',     unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  28, stock_min: 15, sigla: 'S/' },
  { id: 'p12', sku: 'LAC-006', descripcion: 'Leche de almendras',      categoria: 'Lácteos',    precio_publico: 13.50, precio_mayor: 11.00, costo:  5.60, marca: 'Silk',       unidad: 'und', estado: 'INACTIVO', st_producto: 0, stock:   9, stock_min: 15, sigla: 'S/' },
  { id: 'p13', sku: 'ACC-002', descripcion: 'Taza cerámica branded',   categoria: 'Accesorios', precio_publico: 29.00, precio_mayor: 24.00, costo: 11.00, marca: 'FacNet',     unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  33, stock_min: 10, sigla: 'S/' },
  { id: 'p14', sku: 'ACC-005', descripcion: 'Termo 500ml',             categoria: 'Accesorios', precio_publico: 49.00, precio_mayor: 42.00, costo: 22.00, marca: 'Klean K.',   unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  18, stock_min: 10, sigla: 'S/' },
  { id: 'p15', sku: 'CAF-021', descripcion: 'Bolsa café grano 250g',   categoria: 'Café',       precio_publico: 38.00, precio_mayor: 32.00, costo: 14.00, marca: 'Altomayo',   unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  62, stock_min: 10, sigla: 'S/' },
  { id: 'p16', sku: 'BEB-015', descripcion: 'Limonada de maracuyá',    categoria: 'Bebidas',    precio_publico: 10.50, precio_mayor:  8.50, costo:  3.70, marca: 'Cassinelli', unidad: 'und', estado: 'ACTIVO',   st_producto: 1, stock:  40, stock_min: 10, sigla: 'S/' },
];
