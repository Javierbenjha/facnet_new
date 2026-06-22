export type TipoMovimiento   = 'INGRESO' | 'EGRESO';
export type EstadoMovimiento = 'ACTIVO' | 'ANULADO';

// ── Tipos de documento (del backend) ──────────────────────────────────────────
export interface TipoDocCajaChica {
  tipo_doc: number;
  descripcion: string;
  tipo: TipoMovimiento;
  serie: string;
}

export const TIPOS_DOC_CAJA_CHICA: TipoDocCajaChica[] = [
  { tipo_doc: 1, descripcion: 'RECIBO DE EGRESO DE CAJA CHICA',   tipo: 'EGRESO',  serie: 'RE-001' },
  { tipo_doc: 2, descripcion: 'RECIBO DE INGRESO DE CAJA CHICA',  tipo: 'INGRESO', serie: 'RI-001' },
];

// ── Motivos (del backend — se cargan por tipo_doc) ───────────────────────────
export interface MotivoCajaChica {
  id_motivo: number;
  descripcion: string;
  tipo: TipoMovimiento;
}

export const MOTIVOS_MOCK: MotivoCajaChica[] = [
  { id_motivo: 1, descripcion: 'Movilidad / Transporte',   tipo: 'EGRESO'  },
  { id_motivo: 2, descripcion: 'Materiales de Oficina',    tipo: 'EGRESO'  },
  { id_motivo: 3, descripcion: 'Alimentación',             tipo: 'EGRESO'  },
  { id_motivo: 4, descripcion: 'Servicios Básicos',        tipo: 'EGRESO'  },
  { id_motivo: 5, descripcion: 'Limpieza y Mantenimiento', tipo: 'EGRESO'  },
  { id_motivo: 6, descripcion: 'Representación',           tipo: 'EGRESO'  },
  { id_motivo: 7, descripcion: 'Otros',                    tipo: 'EGRESO'  },
  { id_motivo: 8, descripcion: 'Reposición de Fondo',      tipo: 'INGRESO' },
  { id_motivo: 9, descripcion: 'Reintegro',                tipo: 'INGRESO' },
  { id_motivo: 10, descripcion: 'Otros',                   tipo: 'INGRESO' },
];

// ── Monedas ───────────────────────────────────────────────────────────────────
export interface Moneda {
  id_moneda: number;
  descripcion: string;
  sigla: string;
}

export const MONEDAS: Moneda[] = [
  { id_moneda: 1, descripcion: 'Soles',   sigla: 'S/' },
  { id_moneda: 2, descripcion: 'Dólares', sigla: '$'  },
];

// ── Interfaz principal ────────────────────────────────────────────────────────
export interface MovimientoCajaChica {
  id: string;
  fecha: string;
  tipo: TipoMovimiento;
  tipo_doc: number;
  serie: string;
  motivo: string;
  entregado_a: string;
  moneda: 'PEN' | 'USD';
  sigla: 'S/' | '$';
  importe: number;
  detalle?: string;
  estado: EstadoMovimiento;
}

export const SALDO_INICIAL = 500.00;

// ── Opciones para filtro de tipo ──────────────────────────────────────────────
export const TIPO_OPCIONES: { value: '' | TipoMovimiento; label: string }[] = [
  { value: '',        label: 'Todos'   },
  { value: 'INGRESO', label: 'Ingreso' },
  { value: 'EGRESO',  label: 'Egreso'  },
];

// ── Mock data ─────────────────────────────────────────────────────────────────
export const MOVIMIENTOS_MOCK: MovimientoCajaChica[] = [
  {
    id: 'CC-012', fecha: '2026-06-22', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Materiales de Oficina',
    entregado_a: 'Ana García', moneda: 'PEN', sigla: 'S/',
    importe: 45.50, detalle: 'Compra de papel A4 y útiles', estado: 'ACTIVO',
  },
  {
    id: 'CC-011', fecha: '2026-06-22', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Movilidad / Transporte',
    entregado_a: 'Luis Torres', moneda: 'PEN', sigla: 'S/',
    importe: 18.00, detalle: 'Taxi al banco', estado: 'ACTIVO',
  },
  {
    id: 'CC-010', fecha: '2026-06-21', tipo: 'INGRESO', tipo_doc: 2,
    serie: 'RI-001', motivo: 'Reposición de Fondo',
    entregado_a: 'María Quispe', moneda: 'PEN', sigla: 'S/',
    importe: 200.00, detalle: 'Reposición mensual aprobada por gerencia', estado: 'ACTIVO',
  },
  {
    id: 'CC-009', fecha: '2026-06-21', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Alimentación',
    entregado_a: 'Carlos Mendoza', moneda: 'PEN', sigla: 'S/',
    importe: 75.00, detalle: 'Almuerzo reunión con proveedor', estado: 'ACTIVO',
  },
  {
    id: 'CC-008', fecha: '2026-06-20', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Materiales de Oficina',
    entregado_a: 'Ana García', moneda: 'PEN', sigla: 'S/',
    importe: 120.00, detalle: 'Compra de papel A4 y tóner', estado: 'ACTIVO',
  },
  {
    id: 'CC-007', fecha: '2026-06-19', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Alimentación',
    entregado_a: 'Luis Torres', moneda: 'PEN', sigla: 'S/',
    importe: 35.00, estado: 'ACTIVO',
  },
  {
    id: 'CC-006', fecha: '2026-06-18', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Movilidad / Transporte',
    entregado_a: 'José Ramos', moneda: 'PEN', sigla: 'S/',
    importe: 22.00, detalle: 'Pasajes para entrega urgente', estado: 'ACTIVO',
  },
  {
    id: 'CC-005', fecha: '2026-06-17', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Limpieza y Mantenimiento',
    entregado_a: 'María Quispe', moneda: 'PEN', sigla: 'S/',
    importe: 60.00, detalle: 'Anulado por error, se reprocesó', estado: 'ANULADO',
  },
  {
    id: 'CC-004', fecha: '2026-06-16', tipo: 'INGRESO', tipo_doc: 2,
    serie: 'RI-001', motivo: 'Reposición de Fondo',
    entregado_a: 'María Quispe', moneda: 'PEN', sigla: 'S/',
    importe: 300.00, detalle: 'Aprobado por Gerencia General', estado: 'ACTIVO',
  },
  {
    id: 'CC-003', fecha: '2026-06-15', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Materiales de Oficina',
    entregado_a: 'Ana García', moneda: 'PEN', sigla: 'S/',
    importe: 28.50, detalle: 'Útiles de escritorio', estado: 'ACTIVO',
  },
  {
    id: 'CC-002', fecha: '2026-06-14', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Limpieza y Mantenimiento',
    entregado_a: 'Carlos Mendoza', moneda: 'USD', sigla: '$',
    importe: 80.00, detalle: 'Reparación de impresora', estado: 'ACTIVO',
  },
  {
    id: 'CC-001', fecha: '2026-06-13', tipo: 'EGRESO', tipo_doc: 1,
    serie: 'RE-001', motivo: 'Movilidad / Transporte',
    entregado_a: 'José Ramos', moneda: 'PEN', sigla: 'S/',
    importe: 15.00, detalle: 'Envío de documentos por courier', estado: 'ACTIVO',
  },
];
