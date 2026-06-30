export interface PosProducto {
  id: string;
  sku: string;
  descripcion: string;
  categoria: string;
  precio_publico: number;
  precio_publico_soles?: number;
  precio_publico_dolar?: number;
  precio_mayor_soles?: number;
  precio_mayor_dolar?: number;
  precio_costo: number;
  precio_min: number;
  stock: number;
  color: string;
  st_afecto: 0 | 1;
  tipoMoneda: number;
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
  tipoDocLabel:   string;
  serie:          string;
  fechaLabel:     string;
  cliente:        string;
  moneda:         Moneda;
  sigla:          string;
  formaPago:      FormaPago;
  igvPorcentaje:  number;
  igvIncluido:    boolean;
  monto700:       number;
  limitRetencion: number;
  tipoCambio:     number;
  descuento:      number;
  cartLength:     number;
}

export interface CartTotals {
  subtotal:            number;
  brutoGravado:        number;
  inafecto:            number;
  igv:                 number;
  igvPorcentaje:       number;
  total:               number;
  totalAntesDescuento: number;
  gratuito:            number;
  descuentoMonto:      number;
  descuentoPct:        number;
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

