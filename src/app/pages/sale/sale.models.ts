export interface PosProducto {
  id: string;
  sku: string;
  descripcion: string;
  categoria: string;
  precio_publico: number;
  precio_costo: number;
  precio_min: number;
  stock: number;
  color: string;
  st_afecto: 0 | 1;
}

export interface CartItem {
  producto: PosProducto;
  cantidad: number;
  precio_venta: number;
}

export type MetodoPago  = 'efectivo' | 'tarjeta' | 'yape' | 'plin';
export type TipoDoc     = 'boleta' | 'factura' | 'nota_venta';
export type Moneda      = 'PEN' | 'USD';
export type FormaPago   = 'contado' | 'credito';

export interface MetodoPagoOption {
  value: MetodoPago;
  label: string;
  icon: string;
}

export interface TipoDocOption {
  value: TipoDoc;
  label: string;
  serie: string;
}

export const METODOS_PAGO: MetodoPagoOption[] = [
  { value: 'efectivo', label: 'Efectivo', icon: 'pi-money-bill'  },
  { value: 'tarjeta',  label: 'Tarjeta',  icon: 'pi-credit-card' },
  { value: 'yape',     label: 'Yape',     icon: 'pi-mobile'      },
  { value: 'plin',     label: 'Plin',     icon: 'pi-qrcode'      },
];

export const TIPOS_DOC: TipoDocOption[] = [
  { value: 'boleta',     label: 'Boleta',     serie: 'B001' },
  { value: 'factura',    label: 'Factura',    serie: 'F001' },
  { value: 'nota_venta', label: 'Nota Venta', serie: 'NV01' },
];

export interface SaleInfoSummary {
  tipoDocLabel: string;
  serie: string;
  fechaLabel: string;
  cliente: string;
  moneda: Moneda;
  formaPago: FormaPago;
  descuento: number;
  cartLength: number;
}

export interface CartTotals {
  subtotal: number;
  brutoGravado: number;
  inafecto: number;
  igv: number;
  total: number;
  gratuito: number;
  descuentoMonto: number;
  descuento: number;
}

export interface DetraccionConcepto {
  codigo: string;
  descripcion: string;
  porcentaje: number;
}

export const DETRACCION_CONCEPTOS: DetraccionConcepto[] = [
  { codigo: '001', descripcion: 'Azúcar y melaza de caña',            porcentaje: 10 },
  { codigo: '003', descripcion: 'Alcohol etílico',                     porcentaje: 10 },
  { codigo: '005', descripcion: 'Maíz amarillo duro',                  porcentaje: 4  },
  { codigo: '009', descripcion: 'Arena y piedra',                      porcentaje: 10 },
  { codigo: '014', descripcion: 'Carnes y despojos comestibles',       porcentaje: 4  },
  { codigo: '019', descripcion: 'Madera',                              porcentaje: 4  },
  { codigo: '023', descripcion: 'Páprika y otros frutos Capsicum',     porcentaje: 4  },
  { codigo: '029', descripcion: 'Minerales metálicos no auríferos',    porcentaje: 10 },
  { codigo: '037', descripcion: 'Demás servicios gravados con el IGV', porcentaje: 12 },
];

export const RETENCION_PORCENTAJE = 3;

export const POS_PRODUCTOS: PosProducto[] = [
  { id: '1',  sku: 'BEB001', descripcion: 'Coca Cola 600ml',         categoria: 'Bebidas',   precio_publico: 3.50, precio_costo: 2.20, precio_min: 2.80, stock: 48,  color: 'bg-red-100',    st_afecto: 1 },
  { id: '2',  sku: 'BEB002', descripcion: 'Inca Kola 500ml',         categoria: 'Bebidas',   precio_publico: 3.00, precio_costo: 1.90, precio_min: 2.40, stock: 36,  color: 'bg-amber-100',  st_afecto: 1 },
  { id: '3',  sku: 'BEB003', descripcion: 'Agua San Luis 625ml',     categoria: 'Bebidas',   precio_publico: 1.50, precio_costo: 0.70, precio_min: 1.00, stock: 120, color: 'bg-blue-100',   st_afecto: 1 },
  { id: '4',  sku: 'BEB004', descripcion: 'Gatorade Naranja 500ml',  categoria: 'Bebidas',   precio_publico: 4.50, precio_costo: 2.80, precio_min: 3.50, stock: 24,  color: 'bg-orange-100', st_afecto: 1 },
  { id: '5',  sku: 'SNK001', descripcion: 'Lays Clásica 42g',        categoria: 'Snacks',    precio_publico: 2.50, precio_costo: 1.40, precio_min: 1.90, stock: 60,  color: 'bg-yellow-100', st_afecto: 1 },
  { id: '6',  sku: 'SNK002', descripcion: 'Doritos Nacho 80g',       categoria: 'Snacks',    precio_publico: 3.50, precio_costo: 2.10, precio_min: 2.80, stock: 45,  color: 'bg-orange-50',  st_afecto: 1 },
  { id: '7',  sku: 'SNK003', descripcion: 'Sublime 36g',             categoria: 'Snacks',    precio_publico: 1.50, precio_costo: 0.80, precio_min: 1.10, stock: 100, color: 'bg-amber-50',   st_afecto: 1 },
  { id: '8',  sku: 'LAC001', descripcion: 'Leche Gloria 1L',         categoria: 'Lácteos',   precio_publico: 5.90, precio_costo: 4.20, precio_min: 5.00, stock: 30,  color: 'bg-blue-50',    st_afecto: 0 },
  { id: '9',  sku: 'LAC002', descripcion: 'Yogurt Laive Fresa 200g', categoria: 'Lácteos',   precio_publico: 2.80, precio_costo: 1.80, precio_min: 2.20, stock: 20,  color: 'bg-pink-100',   st_afecto: 0 },
  { id: '10', sku: 'LIM001', descripcion: 'Jabón Bolívar 250g',      categoria: 'Limpieza',  precio_publico: 3.20, precio_costo: 1.90, precio_min: 2.50, stock: 40,  color: 'bg-teal-100',   st_afecto: 1 },
  { id: '11', sku: 'LIM002', descripcion: 'Detergente Ariel 360g',   categoria: 'Limpieza',  precio_publico: 7.50, precio_costo: 4.80, precio_min: 6.00, stock: 25,  color: 'bg-cyan-100',   st_afecto: 1 },
  { id: '12', sku: 'PAN001', descripcion: 'Pan Bimbo Blanco 500g',   categoria: 'Panadería', precio_publico: 6.50, precio_costo: 4.50, precio_min: 5.50, stock: 15,  color: 'bg-amber-100',  st_afecto: 0 },
  { id: '13', sku: 'PAN002', descripcion: 'Galleta Oreo 108g',       categoria: 'Panadería', precio_publico: 4.00, precio_costo: 2.50, precio_min: 3.20, stock: 55,  color: 'bg-stone-100',  st_afecto: 1 },
  { id: '14', sku: 'BEB005', descripcion: 'Powerade Azul 500ml',     categoria: 'Bebidas',   precio_publico: 4.00, precio_costo: 2.50, precio_min: 3.20, stock: 18,  color: 'bg-blue-100',   st_afecto: 1 },
  { id: '15', sku: 'SNK004', descripcion: 'Chifles de Sal 80g',      categoria: 'Snacks',    precio_publico: 2.00, precio_costo: 1.10, precio_min: 1.50, stock: 70,  color: 'bg-yellow-50',  st_afecto: 1 },
  { id: '16', sku: 'LAC003', descripcion: 'Queso Laive Fresco 250g', categoria: 'Lácteos',   precio_publico: 8.50, precio_costo: 5.80, precio_min: 7.00, stock: 12,  color: 'bg-stone-50',   st_afecto: 0 },
];
