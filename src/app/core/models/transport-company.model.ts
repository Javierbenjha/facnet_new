/**
 * Transport company (logistics provider) scoped per company (`cia`).
 * Used to register carriers for referral guides, dispatches, etc.
 */
export interface TransportCompany {
  id: number;
  ruc: string;                  // 11 digits
  razon_social: string;
  direccion: string;
  nro_reg_mtc: string;          // MTC registration number
  estado: 1 | 2;                // WARNING: INVERTED — 2 = active, 1 = inactive (opposite of unit/brand)
  cia_id_cia: string;           // bigint serialized as string in JSON
}

/** Body for POST / PATCH. All fields required on create; optional on update. */
export interface CreateTransportCompanyPayload {
  ruc: string;                  // required, exactly 11 characters
  razon_social: string;         // required, max 255 chars
  direccion: string;            // required, max 255 chars
  nro_reg_mtc: string;          // required, max 50 chars
}
