/**
 * Driver (conductor) scoped per company (`cia_id_cia`).
 * GET /drivers returns both active and inactive; DELETE toggles estado 1 <-> 2.
 */
export interface Driver {
  id: number;
  tipo_documento: number;        // FK to document-type catalog (DNI, etc.)
  numero_documento: string;      // max 15 chars
  licencia: string;              // license number, max 15 chars
  nombre: string;                // max 100 chars
  apellido_paterno: string;      // max 100 chars
  apellido_materno: string;      // max 100 chars
  estado: number;                // 1 = active, 2 = inactive
  cia_id_cia: number;
  usuario_adi: number;
  fecha_adi: string;
  usuario_mod: number | null;
  fecha_mod: string | null;
}

/** Body for POST /drivers. All fields required. */
export interface CreateDriverPayload {
  tipo_documento: number;        // required
  numero_documento: string;      // required, max 15
  licencia: string;              // required, max 15
  nombre: string;                // required, max 100
  apellido_paterno: string;      // required, max 100
  apellido_materno: string;      // required, max 100
}

/** Body for PATCH /drivers/:id. All fields optional. */
export type UpdateDriverPayload = Partial<CreateDriverPayload>;
