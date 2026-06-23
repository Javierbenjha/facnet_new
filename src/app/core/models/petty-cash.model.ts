export type TipoMovimiento   = 'INGRESO' | 'EGRESO';
export type EstadoMovimiento = 'ACTIVO' | 'ANULADO';

// ── API: tipos de recibo ───────────────────────────────────────────────────────
export interface ReceiptType {
  id: number;          // 77 = INGRESO | 78 = EGRESO
  descripcion: string;
  sigla: string;       // 'R/I' | 'R/E'
}

// ── API: motivos de caja chica ────────────────────────────────────────────────
export interface Reason {
  id: string;
  descripcion: string;
  tipo_recibo: number;          // 77 | 78
  estado: number;               // 1 = activo | 2 = inactivo
  estadoDescripcion: string | null;
  fecha_adi: string;
  fecha_mod: string | null;
}

export interface CreateReasonPayload {
  descripcion: string;
  tipo_recibo: number;
}

export interface UpdateReasonPayload {
  descripcion?: string;
  tipo_recibo?: number;
}

export const TIPO_A_RECIBO: Record<TipoMovimiento, 77 | 78> = {
  INGRESO: 77,
  EGRESO: 78,
};

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

// ── Movimiento ────────────────────────────────────────────────────────────────
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

export const TIPO_OPCIONES: { value: '' | TipoMovimiento; label: string }[] = [
  { value: '',        label: 'Todos'   },
  { value: 'INGRESO', label: 'Ingreso' },
  { value: 'EGRESO',  label: 'Egreso'  },
];

