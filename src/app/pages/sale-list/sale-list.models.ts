export type EstadoVenta  = 'ACTIVO' | 'ANULADO';
export type EstadoPago   = 'PENDIENTE' | 'PARCIAL' | 'CANCELADO';
export type EstadoSunat  = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'ERROR';

export interface DetalleVentaHistorial {
  producto_nombre: string;
  cantidad: number;
  precio_venta: number;
}

export interface VentaHistorial {
  tip_doc: number;
  sigla_documento: string;
  serie: string;
  correlativo: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  moneda: 'PEN' | 'USD';
  sigla: 'S/' | '$';
  forma_pago: string;
  cliente: string;
  ruc_dni: string;
  subtotal: number;
  descuento: number;
  igv: number;
  total_inafecto: number;
  total_gratuito: number;
  total: number;
  saldo: number;
  estado: EstadoVenta;
  estado_pago: EstadoPago;
  estado_sunat: EstadoSunat;
  detalles?: DetalleVentaHistorial[];
}

export interface TipoDocFiltroOption {
  value: number;
  label: string;
}

export const TIPO_DOC_OPCIONES: TipoDocFiltroOption[] = [
  { value: 0, label: 'Todos' },
  { value: 1, label: 'Factura' },
  { value: 2, label: 'Boleta' },
  { value: 7, label: 'Nota de Crédito' },
  { value: 8, label: 'Nota de Débito' },
  { value: 99, label: 'Doc. Interno' },
];

export const VENTAS_MOCK: VentaHistorial[] = [
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000145',
    fecha_emision: '2026-06-15', fecha_vencimiento: '2026-06-15',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'CONSUMIDOR FINAL', ruc_dni: '',
    subtotal: 42.37, descuento: 0, igv: 7.63, total_inafecto: 0, total_gratuito: 0, total: 50.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Coca Cola 600ml',     cantidad: 5, precio_venta: 3.50 },
      { producto_nombre: 'Lays Clásica 42g',    cantidad: 4, precio_venta: 2.50 },
      { producto_nombre: 'Agua San Luis 625ml', cantidad: 10, precio_venta: 1.50 },
    ],
  },
  {
    tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000042',
    fecha_emision: '2026-06-14', fecha_vencimiento: '2026-07-14',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito',
    cliente: 'DISTRIBUIDORA NORTE S.A.C.', ruc_dni: '20456789012',
    subtotal: 847.46, descuento: 0, igv: 152.54, total_inafecto: 0, total_gratuito: 0, total: 1000.00, saldo: 1000.00,
    estado: 'ACTIVO', estado_pago: 'PENDIENTE', estado_sunat: 'ACEPTADA',
    detalles: [
      { producto_nombre: 'Detergente Ariel 360g', cantidad: 50, precio_venta: 7.50 },
      { producto_nombre: 'Jabón Bolívar 250g',    cantidad: 80, precio_venta: 3.20 },
    ],
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000144',
    fecha_emision: '2026-06-14', fecha_vencimiento: '2026-06-14',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'CONSUMIDOR FINAL', ruc_dni: '',
    subtotal: 25.42, descuento: 0, igv: 4.58, total_inafecto: 0, total_gratuito: 0, total: 30.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Gatorade Naranja 500ml', cantidad: 4, precio_venta: 4.50 },
      { producto_nombre: 'Doritos Nacho 80g',      cantidad: 4, precio_venta: 3.50 },
    ],
  },
  {
    tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000041',
    fecha_emision: '2026-06-13', fecha_vencimiento: '2026-07-13',
    moneda: 'USD', sigla: '$', forma_pago: 'Crédito',
    cliente: 'IMPORTADORA DEL PACÍFICO E.I.R.L.', ruc_dni: '20387654321',
    subtotal: 847.46, descuento: 0, igv: 152.54, total_inafecto: 0, total_gratuito: 0, total: 1000.00, saldo: 500.00,
    estado: 'ACTIVO', estado_pago: 'PARCIAL', estado_sunat: 'ACEPTADA',
    detalles: [
      { producto_nombre: 'Coca Cola 600ml', cantidad: 200, precio_venta: 3.50 },
      { producto_nombre: 'Inca Kola 500ml', cantidad: 150, precio_venta: 3.00 },
    ],
  },
  {
    tip_doc: 7, sigla_documento: 'NC', serie: 'B001', correlativo: '000003',
    fecha_emision: '2026-06-13', fecha_vencimiento: '2026-06-13',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'CONSUMIDOR FINAL', ruc_dni: '',
    subtotal: 8.47, descuento: 0, igv: 1.53, total_inafecto: 0, total_gratuito: 0, total: 10.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Coca Cola 600ml', cantidad: 2, precio_venta: 3.50 },
      { producto_nombre: 'Lays Clásica 42g', cantidad: 1, precio_venta: 2.50 },
    ],
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000143',
    fecha_emision: '2026-06-12', fecha_vencimiento: '2026-06-12',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'JUAN CARLOS RÍOS FLORES', ruc_dni: '45678901',
    subtotal: 16.95, descuento: 0, igv: 3.05, total_inafecto: 0, total_gratuito: 0, total: 20.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000040',
    fecha_emision: '2026-06-11', fecha_vencimiento: '2026-07-11',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito',
    cliente: 'SUPERMERCADOS METRO S.A.', ruc_dni: '20100049056',
    subtotal: 4237.29, descuento: 0, igv: 762.71, total_inafecto: 0, total_gratuito: 0, total: 5000.00, saldo: 5000.00,
    estado: 'ACTIVO', estado_pago: 'PENDIENTE', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000142',
    fecha_emision: '2026-06-10', fecha_vencimiento: '2026-06-10',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'CONSUMIDOR FINAL', ruc_dni: '',
    subtotal: 33.90, descuento: 5.09, igv: 5.20, total_inafecto: 0, total_gratuito: 0, total: 34.01, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000141',
    fecha_emision: '2026-06-09', fecha_vencimiento: '2026-06-09',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'MARÍA ELENA TORRES V.', ruc_dni: '72345678',
    subtotal: 50.85, descuento: 0, igv: 9.15, total_inafecto: 0, total_gratuito: 0, total: 60.00, saldo: 0,
    estado: 'ANULADO', estado_pago: 'CANCELADO', estado_sunat: 'RECHAZADA',
  },
  {
    tip_doc: 99, sigla_documento: 'NV', serie: 'NV01', correlativo: '000020',
    fecha_emision: '2026-06-09', fecha_vencimiento: '2026-06-09',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'CONSUMIDOR FINAL', ruc_dni: '',
    subtotal: 0, descuento: 0, igv: 0, total_inafecto: 8.00, total_gratuito: 0, total: 8.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000039',
    fecha_emision: '2026-06-08', fecha_vencimiento: '2026-07-08',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito',
    cliente: 'GRUPO ÉXITO RETAIL S.A.C.', ruc_dni: '20987654321',
    subtotal: 2118.64, descuento: 0, igv: 381.36, total_inafecto: 0, total_gratuito: 0, total: 2500.00, saldo: 1250.00,
    estado: 'ACTIVO', estado_pago: 'PARCIAL', estado_sunat: 'ACEPTADA',
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000140',
    fecha_emision: '2026-06-07', fecha_vencimiento: '2026-06-07',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'PEDRO ALVA MENDOZA', ruc_dni: '09876543',
    subtotal: 67.80, descuento: 0, igv: 12.20, total_inafecto: 0, total_gratuito: 0, total: 80.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000038',
    fecha_emision: '2026-06-06', fecha_vencimiento: '2026-07-06',
    moneda: 'USD', sigla: '$', forma_pago: 'Contado',
    cliente: 'TECH SOLUTIONS PERU S.A.C.', ruc_dni: '20567891234',
    subtotal: 423.73, descuento: 0, igv: 76.27, total_inafecto: 0, total_gratuito: 0, total: 500.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'ACEPTADA',
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000139',
    fecha_emision: '2026-06-05', fecha_vencimiento: '2026-06-05',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'CONSUMIDOR FINAL', ruc_dni: '',
    subtotal: 21.19, descuento: 0, igv: 3.81, total_inafecto: 0, total_gratuito: 0, total: 25.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 8, sigla_documento: 'ND', serie: 'F001', correlativo: '000005',
    fecha_emision: '2026-06-04', fecha_vencimiento: '2026-06-04',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito',
    cliente: 'DISTRIBUIDORA NORTE S.A.C.', ruc_dni: '20456789012',
    subtotal: 84.75, descuento: 0, igv: 15.25, total_inafecto: 0, total_gratuito: 0, total: 100.00, saldo: 100.00,
    estado: 'ACTIVO', estado_pago: 'PENDIENTE', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000138',
    fecha_emision: '2026-06-03', fecha_vencimiento: '2026-06-03',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'ROSA QUISPE MAMANI', ruc_dni: '23456789',
    subtotal: 42.37, descuento: 0, igv: 7.63, total_inafecto: 0, total_gratuito: 0, total: 50.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'ERROR',
  },
  {
    tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000037',
    fecha_emision: '2026-06-02', fecha_vencimiento: '2026-07-02',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito',
    cliente: 'MINIMARKET PERÚ E.I.R.L.', ruc_dni: '20765432109',
    subtotal: 1271.19, descuento: 0, igv: 228.81, total_inafecto: 0, total_gratuito: 0, total: 1500.00, saldo: 1500.00,
    estado: 'ACTIVO', estado_pago: 'PENDIENTE', estado_sunat: 'PENDIENTE',
  },
  {
    tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000137',
    fecha_emision: '2026-06-01', fecha_vencimiento: '2026-06-01',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente: 'CONSUMIDOR FINAL', ruc_dni: '',
    subtotal: 16.95, descuento: 0, igv: 3.05, total_inafecto: 0, total_gratuito: 0, total: 20.00, saldo: 0,
    estado: 'ACTIVO', estado_pago: 'CANCELADO', estado_sunat: 'PENDIENTE',
  },
];
