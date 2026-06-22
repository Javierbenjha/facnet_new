export type TipoMovimiento   = 'INGRESO' | 'EGRESO';
export type EstadoMovimiento = 'ACTIVO' | 'ANULADO';

// ── Form constants ─────────────────────────────────────────────────────────────
export const CATEGORIAS_INGRESO: string[] = [
  'Reposición de Fondo',
  'Reintegro',
  'Otros',
];

export const CATEGORIAS_EGRESO: string[] = [
  'Movilidad / Transporte',
  'Materiales de Oficina',
  'Alimentación',
  'Servicios Básicos',
  'Limpieza y Mantenimiento',
  'Representación',
  'Otros',
];

// ── List types & data ──────────────────────────────────────────────────────────
export interface MovimientoCajaChica {
  id: string;
  fecha: string;
  tipo: TipoMovimiento;
  concepto: string;
  categoria: string;
  monto: number;
  responsable: string;
  comprobante?: string;
  observaciones?: string;
  estado: EstadoMovimiento;
}

export const TIPO_OPCIONES: { value: '' | TipoMovimiento; label: string }[] = [
  { value: '',         label: 'Todos'   },
  { value: 'INGRESO',  label: 'Ingreso' },
  { value: 'EGRESO',   label: 'Egreso'  },
];

export const SALDO_INICIAL = 500.00;

export const MOVIMIENTOS_MOCK: MovimientoCajaChica[] = [
  {
    id: 'CC-012', fecha: '2026-06-22', tipo: 'EGRESO',
    concepto: 'Compra de materiales de oficina', categoria: 'Materiales de Oficina',
    monto: 45.50, responsable: 'Ana García', comprobante: 'Boleta B001-00123', estado: 'ACTIVO',
  },
  {
    id: 'CC-011', fecha: '2026-06-22', tipo: 'EGRESO',
    concepto: 'Servicio de taxi al banco', categoria: 'Movilidad / Transporte',
    monto: 18.00, responsable: 'Luis Torres', comprobante: 'Recibo N° 0452', estado: 'ACTIVO',
  },
  {
    id: 'CC-010', fecha: '2026-06-21', tipo: 'INGRESO',
    concepto: 'Reposición de caja chica', categoria: 'Reposición de Fondo',
    monto: 200.00, responsable: 'María Quispe',
    observaciones: 'Reposición mensual aprobada por gerencia', estado: 'ACTIVO',
  },
  {
    id: 'CC-009', fecha: '2026-06-21', tipo: 'EGRESO',
    concepto: 'Almuerzo reunión con proveedor', categoria: 'Alimentación',
    monto: 75.00, responsable: 'Carlos Mendoza', comprobante: 'Boleta B002-00587', estado: 'ACTIVO',
  },
  {
    id: 'CC-008', fecha: '2026-06-20', tipo: 'EGRESO',
    concepto: 'Compra de papel A4 y tóner', categoria: 'Materiales de Oficina',
    monto: 120.00, responsable: 'Ana García', comprobante: 'Factura F001-01234', estado: 'ACTIVO',
  },
  {
    id: 'CC-007', fecha: '2026-06-19', tipo: 'EGRESO',
    concepto: 'Agua mineral y café para oficina', categoria: 'Alimentación',
    monto: 35.00, responsable: 'Luis Torres', estado: 'ACTIVO',
  },
  {
    id: 'CC-006', fecha: '2026-06-18', tipo: 'EGRESO',
    concepto: 'Pasajes para entrega urgente', categoria: 'Movilidad / Transporte',
    monto: 22.00, responsable: 'José Ramos', comprobante: 'Recibo N° 0441', estado: 'ACTIVO',
  },
  {
    id: 'CC-005', fecha: '2026-06-17', tipo: 'EGRESO',
    concepto: 'Limpieza de oficina mensual', categoria: 'Limpieza y Mantenimiento',
    monto: 60.00, responsable: 'María Quispe', comprobante: 'Recibo N° 0039',
    observaciones: 'Anulado por error, se reprocesó', estado: 'ANULADO',
  },
  {
    id: 'CC-004', fecha: '2026-06-16', tipo: 'INGRESO',
    concepto: 'Reposición extraordinaria', categoria: 'Reposición de Fondo',
    monto: 300.00, responsable: 'María Quispe',
    observaciones: 'Aprobado por Gerencia General', estado: 'ACTIVO',
  },
  {
    id: 'CC-003', fecha: '2026-06-15', tipo: 'EGRESO',
    concepto: 'Útiles de escritorio', categoria: 'Materiales de Oficina',
    monto: 28.50, responsable: 'Ana García', comprobante: 'Boleta B001-00120', estado: 'ACTIVO',
  },
  {
    id: 'CC-002', fecha: '2026-06-14', tipo: 'EGRESO',
    concepto: 'Reparación de impresora', categoria: 'Limpieza y Mantenimiento',
    monto: 80.00, responsable: 'Carlos Mendoza', comprobante: 'Boleta B003-00045', estado: 'ACTIVO',
  },
  {
    id: 'CC-001', fecha: '2026-06-13', tipo: 'EGRESO',
    concepto: 'Envío de documentos por courier', categoria: 'Movilidad / Transporte',
    monto: 15.00, responsable: 'José Ramos', comprobante: 'Recibo Olva N° 8832', estado: 'ACTIVO',
  },
];
