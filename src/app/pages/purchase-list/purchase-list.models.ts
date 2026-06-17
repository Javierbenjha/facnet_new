export type EstadoCompra  = 'PENDIENTE' | 'PAGADA' | 'ANULADA';
export type FormaPagoCompra = 'CONTADO' | 'CREDITO';

export interface DetalleCompraHistorial {
  producto_nombre: string;
  cantidad: number;
  precio_venta: number;
}

export interface CompraHistorial {
  id_compra: number;
  tip_doc: number;
  sigla_documento: string;
  serie: string;
  correlativo: string;
  serie_referencia?: string;
  correlativo_referencia?: string;
  fecha_compra: string;
  fecha_vencimiento: string;
  moneda: 'PEN' | 'USD';
  sigla: 'S/' | '$';
  forma_pago: FormaPagoCompra;
  proveedor: string;
  ruc_proveedor: string;
  subtotal: number;
  descuento: number;
  igv: number;
  total: number;
  saldo: number;
  estado: EstadoCompra;
  detalles?: DetalleCompraHistorial[];
}

export interface TipoDocCompraOption {
  value: number;
  label: string;
  sigla: string;
  requiresSerie: boolean;
  requiresRef: boolean;
}

export const TIPOS_DOC_COMPRA: TipoDocCompraOption[] = [
  { value: 1,  label: 'Factura',          sigla: 'F',  requiresSerie: true,  requiresRef: false },
  { value: 2,  label: 'Boleta',           sigla: 'B',  requiresSerie: true,  requiresRef: false },
  { value: 7,  label: 'Nota de Crédito',  sigla: 'NC', requiresSerie: true,  requiresRef: true  },
  { value: 8,  label: 'Nota de Débito',   sigla: 'ND', requiresSerie: true,  requiresRef: true  },
  { value: 99, label: 'Doc. Interno',     sigla: 'DI', requiresSerie: false, requiresRef: false },
];

export const TIPO_DOC_FILTRO_COMPRA = [
  { value: 0,  label: 'Todos'           },
  { value: 1,  label: 'Factura'         },
  { value: 2,  label: 'Boleta'          },
  { value: 7,  label: 'Nota de Crédito' },
  { value: 8,  label: 'Nota de Débito'  },
  { value: 99, label: 'Doc. Interno'    },
];

export interface PurchaseItem {
  id: string;
  nombre: string;
  sku: string;
  unidad: string;
  cantidad: number;
  precio: number;
}

export const COMPRAS_MOCK: CompraHistorial[] = [
  {
    id_compra: 1, tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000125',
    fecha_compra: '2026-06-15', fecha_vencimiento: '2026-07-15',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CREDITO',
    proveedor: 'ALICORP S.A.A.', ruc_proveedor: '20100055237',
    subtotal: 847.46, descuento: 0, igv: 152.54, total: 1000.00, saldo: 1000.00,
    estado: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Detergente Ariel 360g', cantidad: 50, precio_venta: 7.50 },
      { producto_nombre: 'Jabón Bolívar 250g',    cantidad: 80, precio_venta: 3.20 },
    ],
  },
  {
    id_compra: 2, tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000124',
    fecha_compra: '2026-06-14', fecha_vencimiento: '2026-07-14',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CONTADO',
    proveedor: 'COCA-COLA FEMSA PERÚ S.A.', ruc_proveedor: '20100113610',
    subtotal: 2118.64, descuento: 0, igv: 381.36, total: 2500.00, saldo: 0,
    estado: 'PAGADA',
    detalles: [
      { producto_nombre: 'Coca Cola 600ml x24',  cantidad: 20, precio_venta: 60.00 },
      { producto_nombre: 'Inca Kola 500ml x24',  cantidad: 15, precio_venta: 55.00 },
      { producto_nombre: 'Sprite 500ml x24',     cantidad: 10, precio_venta: 52.00 },
    ],
  },
  {
    id_compra: 3, tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000089',
    fecha_compra: '2026-06-13', fecha_vencimiento: '2026-06-13',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CONTADO',
    proveedor: 'DISTRIBUIDORA LA MERCED E.I.R.L.', ruc_proveedor: '20456123789',
    subtotal: 423.73, descuento: 21.19, igv: 72.46, total: 475.00, saldo: 0,
    estado: 'PAGADA',
    detalles: [
      { producto_nombre: 'Lays Clásica 42g x24',  cantidad: 10, precio_venta: 25.00 },
      { producto_nombre: 'Doritos Nacho 80g x12', cantidad: 12, precio_venta: 22.50 },
    ],
  },
  {
    id_compra: 4, tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000123',
    fecha_compra: '2026-06-12', fecha_vencimiento: '2026-07-12',
    moneda: 'USD', sigla: '$', forma_pago: 'CREDITO',
    proveedor: 'IMPORTADORA DEL PACÍFICO E.I.R.L.', ruc_proveedor: '20387654321',
    subtotal: 847.46, descuento: 0, igv: 152.54, total: 1000.00, saldo: 500.00,
    estado: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Gatorade Naranja 500ml x24', cantidad: 30, precio_venta: 22.00 },
    ],
  },
  {
    id_compra: 5, tip_doc: 7, sigla_documento: 'NC', serie: 'F001', correlativo: '000010',
    serie_referencia: 'F001', correlativo_referencia: '000120',
    fecha_compra: '2026-06-11', fecha_vencimiento: '2026-06-11',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CONTADO',
    proveedor: 'ALICORP S.A.A.', ruc_proveedor: '20100055237',
    subtotal: 84.75, descuento: 0, igv: 15.25, total: 100.00, saldo: 0,
    estado: 'PAGADA',
    detalles: [
      { producto_nombre: 'Detergente Ariel 360g', cantidad: 5, precio_venta: 7.50 },
    ],
  },
  {
    id_compra: 6, tip_doc: 99, sigla_documento: 'DI', serie: 'DI01', correlativo: '000045',
    fecha_compra: '2026-06-10', fecha_vencimiento: '2026-06-10',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CONTADO',
    proveedor: 'CLIENTES OTROS', ruc_proveedor: '00000000',
    subtotal: 0, descuento: 0, igv: 0, total: 50.00, saldo: 0,
    estado: 'PAGADA',
  },
  {
    id_compra: 7, tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000122',
    fecha_compra: '2026-06-09', fecha_vencimiento: '2026-07-09',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CREDITO',
    proveedor: 'NESTLÉ PERÚ S.A.', ruc_proveedor: '20100116392',
    subtotal: 1271.19, descuento: 0, igv: 228.81, total: 1500.00, saldo: 1500.00,
    estado: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Milo 400g x12',       cantidad: 20, precio_venta: 35.00 },
      { producto_nombre: 'Nesquik 200g x12',     cantidad: 15, precio_venta: 28.00 },
      { producto_nombre: 'Nescafé Classic 50g',  cantidad: 30, precio_venta: 12.00 },
    ],
  },
  {
    id_compra: 8, tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000121',
    fecha_compra: '2026-06-07', fecha_vencimiento: '2026-07-07',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CONTADO',
    proveedor: 'P&G DISTRIBUIDORA PERÚ S.A.C.', ruc_proveedor: '20521879748',
    subtotal: 635.59, descuento: 63.56, igv: 102.96, total: 675.00, saldo: 0,
    estado: 'PAGADA',
  },
  {
    id_compra: 9, tip_doc: 2, sigla_documento: 'B', serie: 'B001', correlativo: '000088',
    fecha_compra: '2026-06-05', fecha_vencimiento: '2026-06-05',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CONTADO',
    proveedor: 'MINIMARKET EXPRESS S.A.C.', ruc_proveedor: '20601234567',
    subtotal: 211.86, descuento: 0, igv: 38.14, total: 250.00, saldo: 0,
    estado: 'ANULADA',
  },
  {
    id_compra: 10, tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000120',
    fecha_compra: '2026-06-03', fecha_vencimiento: '2026-07-03',
    moneda: 'USD', sigla: '$', forma_pago: 'CREDITO',
    proveedor: 'TECH SOLUTIONS PERU S.A.C.', ruc_proveedor: '20567891234',
    subtotal: 423.73, descuento: 0, igv: 76.27, total: 500.00, saldo: 500.00,
    estado: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Agua San Luis 625ml x24', cantidad: 50, precio_venta: 6.00 },
    ],
  },
  {
    id_compra: 11, tip_doc: 8, sigla_documento: 'ND', serie: 'F001', correlativo: '000003',
    serie_referencia: 'F001', correlativo_referencia: '000115',
    fecha_compra: '2026-06-01', fecha_vencimiento: '2026-06-01',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CREDITO',
    proveedor: 'ALICORP S.A.A.', ruc_proveedor: '20100055237',
    subtotal: 42.37, descuento: 0, igv: 7.63, total: 50.00, saldo: 50.00,
    estado: 'PENDIENTE',
  },
  {
    id_compra: 12, tip_doc: 1, sigla_documento: 'F', serie: 'F001', correlativo: '000119',
    fecha_compra: '2026-05-30', fecha_vencimiento: '2026-06-30',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'CONTADO',
    proveedor: 'COCA-COLA FEMSA PERÚ S.A.', ruc_proveedor: '20100113610',
    subtotal: 3389.83, descuento: 0, igv: 610.17, total: 4000.00, saldo: 0,
    estado: 'PAGADA',
    detalles: [
      { producto_nombre: 'Coca Cola 600ml x24',  cantidad: 40, precio_venta: 60.00 },
      { producto_nombre: 'Inca Kola 500ml x24',  cantidad: 30, precio_venta: 55.00 },
      { producto_nombre: 'Fanta Naranja x24',    cantidad: 20, precio_venta: 50.00 },
    ],
  },
];
