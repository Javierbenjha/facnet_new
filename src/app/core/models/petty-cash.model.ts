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

// ── API: recibos de caja chica ────────────────────────────────────────────────
export interface Receipt {
  id: string;
  cia_id_cia: string;
  tip_doc: number;              // 77 = ingreso | 78 = egreso
  tipDocDescripcion: string | null;
  serie: string;
  correlativo: string;
  numero: string;               // "serie-correlativo", ej. "0027-00000004"
  fecha: string;                // ISO 8601
  entregado: string;
  codigo_motivo: string;
  motivoDescripcion: string | null;
  tipo_moneda: number;
  monedaDescripcion: string | null;
  importe: string;              // decimal como string
  observacion: string;
  estado: number;
  estadoDescripcion: string | null;
  fecha_adi: string;
  fecha_mod: string | null;
}

export interface CreateReceiptPayload {
  tip_doc: number;
  fecha: string;                // YYYY-MM-DD
  entregado: string;
  codigo_motivo: number;
  tipo_moneda: number;
  importe: number;
  observacion: string;
}

export interface UpdateReceiptPayload {
  fecha?: string;
  entregado?: string;
  codigo_motivo?: number;
  tipo_moneda?: number;
  importe?: number;
  observacion?: string;
}

export interface ReceiptListResponse {
  data: Receipt[];
  meta: { total: number; page: number; limit: number; lastPage: number };
}

// ── Movimiento (legacy — reemplazar por Receipt al migrar la tabla) ────────────
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

