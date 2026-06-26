/** Unit of measure. The special `"NT"` unit is auto-created per company and excluded from listings. */
export interface Unit {
  id: string;
  descripcion: string;          // e.g. "KILOGRAMO"
  siglas: string;               // e.g. "KG"
  estado: number;               // 1 = active, 2 = inactive
  fecha_adi: string | null;
  fecha_mod: string | null;
}

/** Paginated response from `GET /unit`. */
export interface UnitPage {
  data: Unit[];
  total: number;
  page: number;
  limit: number;
}

/** Body for `POST /unit`. Both fields required. */
export interface CreateUnitPayload {
  descripcion: string;          // required, max 150 chars
  siglas: string;               // required, max 30 chars (abbreviation)
}

/** Unit estado values. */
export const UNIT_ESTADO = {
  ACTIVE: 1,
  INACTIVE: 2,
} as const;

/** Max field lengths enforced by the API. */
export const UNIT_LIMITS = {
  DESCRIPCION_MAX: 150,
  SIGLAS_MAX: 30,
} as const;
