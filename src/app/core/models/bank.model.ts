/**
 * Bank account scoped per company (`cia`). Owner-only (role=1) for all operations.
 * NOTE on shape asymmetry:
 *  - GET /bank (list) returns `estado` and `tipo_moneda` as descriptive STRINGS (SQL joins).
 *  - GET /bank/:id (detail) returns them as raw NUMBERS.
 */
export interface Bank {
  id_banco: number;
  descripcion: string;
  nrocuenta: string;
  tipo_moneda: number;          // FK to moneda catalog (numeric in detail)
  estado: number;               // 1 = active, 2 = inactive
  cia_id_cia: string;           // bigint serialized as string in JSON
}

/**
 * List item (GET /bank). Overrides `estado` and `tipo_moneda` to strings (joined).
 * Uses Omit because a plain `extends` can't change number -> string (TS2430).
 */
export interface BankListItem extends Omit<Bank, 'estado' | 'tipo_moneda'> {
  estado: string;               // join: "Activo" / "Inactivo"
  tipo_moneda: string;          // join: e.g. "SOLES", "USD"
}

/** Body for POST / PATCH. tipo_moneda is the moneda ID (see CurrencyService.findActive). */
export interface CreateBankPayload {
  descripcion: string;          // required
  nrocuenta: string;            // required, account number
  tipo_moneda: number;          // required, moneda ID
}
