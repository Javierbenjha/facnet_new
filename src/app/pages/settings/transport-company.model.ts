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
  estado: number;               // 1 = active, 0 = inactive (NOTE: not 2, unlike unit/bank)
  cia_id_cia: string;           // bigint serialized as string in JSON
}

/** Body for POST / PATCH. All fields required on create; optional on update. */
export interface CreateTransportCompanyPayload {
  ruc: string;                  // required, exactly 11 characters
  razon_social: string;         // required, max 255 chars
  direccion: string;            // required, max 255 chars
  nro_reg_mtc: string;          // required, max 50 chars
}

/** Estado values for a transport company. */
export const TRANSPORT_COMPANY_ESTADO = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

/** Field constraints enforced by the API. */
export const TRANSPORT_COMPANY_LIMITS = {
  RUC_LENGTH: 11,
  RAZON_SOCIAL_MAX: 255,
  DIRECCION_MAX: 255,
  NRO_REG_MTC_MAX: 50,
} as const;
