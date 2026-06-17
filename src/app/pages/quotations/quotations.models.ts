export type EstadoCotizacion   = 'PENDIENTE' | 'APROBADA' | 'ANULADA';
export type EstadoFacturacion  = 'PENDIENTE' | 'FACTURADA';
export type Moneda             = 'PEN' | 'USD';

export interface DetalleCotizacion {
  producto_nombre: string;
  cantidad:        number;
  precio_lista:    number;
  precio_venta:    number;
  descuento:       number;
  total:           number;
}

export interface Cotizacion {
  id:                 string;
  serie:              string;
  correlativo:        string;
  fecha_emision:      string;
  fecha_vencimiento:  string;
  moneda:             Moneda;
  sigla:              'S/' | '$';
  forma_pago:         string;
  cliente_nombre:     string;
  cliente_documento:  string;
  subtotal:           number;
  igv:                number;
  descuento:          number;
  total:              number;
  estado:             EstadoCotizacion;
  estado_facturacion: EstadoFacturacion;
  detalles?:          DetalleCotizacion[];
}

export const COTIZACIONES_MOCK: Cotizacion[] = [
  {
    id: '1', serie: 'C001', correlativo: '000008',
    fecha_emision: '2026-06-16', fecha_vencimiento: '2026-07-16',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito 30 días',
    cliente_nombre: 'DISTRIBUIDORA NORTE S.A.C.', cliente_documento: '20456789012',
    subtotal: 4237.29, igv: 762.71, descuento: 0, total: 5000.00,
    estado: 'PENDIENTE', estado_facturacion: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Laptop HP 15 Core i5 16GB',      cantidad: 1, precio_lista: 3800, precio_venta: 3500, descuento: 300, total: 3500.00 },
      { producto_nombre: 'Mouse Inalámbrico Logitech MX',  cantidad: 4, precio_lista: 175,  precio_venta: 150,  descuento: 100, total: 600.00  },
      { producto_nombre: 'Teclado Mecánico Redragon K552', cantidad: 4, precio_lista: 140,  precio_venta: 120,  descuento: 80,  total: 480.00  },
      { producto_nombre: 'Cable HDMI 4K 2m',               cantidad: 5, precio_lista: 50,   precio_venta: 45,   descuento: 25,  total: 225.00  },
    ],
  },
  {
    id: '2', serie: 'C001', correlativo: '000007',
    fecha_emision: '2026-06-14', fecha_vencimiento: '2026-07-14',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente_nombre: 'SUPERMERCADOS METRO S.A.', cliente_documento: '20100049056',
    subtotal: 2711.86, igv: 488.14, descuento: 0, total: 3200.00,
    estado: 'APROBADA', estado_facturacion: 'FACTURADA',
    detalles: [
      { producto_nombre: 'Impresora Epson EcoTank L3250', cantidad: 2, precio_lista: 720, precio_venta: 650, descuento: 140, total: 1300.00 },
      { producto_nombre: 'Monitor LG 24\'\' Full HD',     cantidad: 2, precio_lista: 650, precio_venta: 580, descuento: 140, total: 1160.00 },
      { producto_nombre: 'Webcam Logitech C920 HD Pro',  cantidad: 2, precio_lista: 400, precio_venta: 350, descuento: 100, total: 700.00  },
    ],
  },
  {
    id: '3', serie: 'C001', correlativo: '000006',
    fecha_emision: '2026-06-12', fecha_vencimiento: '2026-07-12',
    moneda: 'USD', sigla: '$', forma_pago: 'Crédito 30 días',
    cliente_nombre: 'IMPORTADORA DEL PACÍFICO E.I.R.L.', cliente_documento: '20387654321',
    subtotal: 2118.64, igv: 381.36, descuento: 0, total: 2500.00,
    estado: 'PENDIENTE', estado_facturacion: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Auriculares Sony WH-1000XM4', cantidad: 3, precio_lista: 310, precio_venta: 280, descuento: 90,  total: 840.00 },
      { producto_nombre: 'SSD Samsung 1TB NVMe',        cantidad: 2, precio_lista: 480, precio_venta: 420, descuento: 120, total: 840.00 },
      { producto_nombre: 'USB Hub 7 puertos USB 3.0',   cantidad: 5, precio_lista: 95,  precio_venta: 89,  descuento: 30,  total: 445.00 },
    ],
  },
  {
    id: '4', serie: 'C001', correlativo: '000005',
    fecha_emision: '2026-06-10', fecha_vencimiento: '2026-06-25',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente_nombre: 'GRUPO ÉXITO RETAIL S.A.C.', cliente_documento: '20987654321',
    subtotal: 677.97, igv: 122.03, descuento: 0, total: 800.00,
    estado: 'ANULADA', estado_facturacion: 'PENDIENTE',
  },
  {
    id: '5', serie: 'C001', correlativo: '000004',
    fecha_emision: '2026-06-08', fecha_vencimiento: '2026-07-08',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito 30 días',
    cliente_nombre: 'MINIMARKET PERÚ E.I.R.L.', cliente_documento: '20765432109',
    subtotal: 4237.29, igv: 762.71, descuento: 0, total: 5000.00,
    estado: 'APROBADA', estado_facturacion: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Laptop HP 15 Core i5 16GB',   cantidad: 1, precio_lista: 3800, precio_venta: 3500, descuento: 300, total: 3500.00 },
      { producto_nombre: 'Impresora Epson EcoTank L3250', cantidad: 1, precio_lista: 720, precio_venta: 650, descuento: 70,  total: 650.00  },
      { producto_nombre: 'Monitor LG 24\'\' Full HD',   cantidad: 1, precio_lista: 650,  precio_venta: 580,  descuento: 70,  total: 580.00  },
    ],
  },
  {
    id: '6', serie: 'C001', correlativo: '000003',
    fecha_emision: '2026-06-05', fecha_vencimiento: '2026-07-05',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Contado',
    cliente_nombre: 'COMERCIAL LOS ANDES S.A.C.', cliente_documento: '20749652321',
    subtotal: 1016.95, igv: 183.05, descuento: 0, total: 1200.00,
    estado: 'PENDIENTE', estado_facturacion: 'PENDIENTE',
  },
  {
    id: '7', serie: 'C001', correlativo: '000002',
    fecha_emision: '2026-06-02', fecha_vencimiento: '2026-07-02',
    moneda: 'USD', sigla: '$', forma_pago: 'Contado',
    cliente_nombre: 'TECH SOLUTIONS PERU S.A.C.', cliente_documento: '20567891234',
    subtotal: 1525.42, igv: 274.58, descuento: 0, total: 1800.00,
    estado: 'APROBADA', estado_facturacion: 'FACTURADA',
  },
  {
    id: '8', serie: 'C001', correlativo: '000001',
    fecha_emision: '2026-06-01', fecha_vencimiento: '2026-06-30',
    moneda: 'PEN', sigla: 'S/', forma_pago: 'Crédito 30 días',
    cliente_nombre: 'DISTRIBUIDORA NORTE S.A.C.', cliente_documento: '20456789012',
    subtotal: 2372.88, igv: 427.12, descuento: 0, total: 2800.00,
    estado: 'APROBADA', estado_facturacion: 'PENDIENTE',
    detalles: [
      { producto_nombre: 'Monitor LG 24\'\' Full HD',     cantidad: 3, precio_lista: 650, precio_venta: 580, descuento: 210, total: 1740.00 },
      { producto_nombre: 'Teclado Mecánico Redragon K552', cantidad: 5, precio_lista: 140, precio_venta: 120, descuento: 100, total: 600.00 },
      { producto_nombre: 'Mouse Inalámbrico Logitech MX',  cantidad: 3, precio_lista: 175, precio_venta: 150, descuento: 75,  total: 450.00 },
    ],
  },
];
