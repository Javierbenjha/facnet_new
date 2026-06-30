/**
 * Currency configured for a company (`cia`). Read-only catalog:
 * the backend exposes only GET /currency and GET /currency/st_currency.
 */
export interface CurrencyEntry {
  id: string;             // BigInt serialized as string
  cia_id_cia: string;     // BigInt — company ID
  id_moneda: string;      // BigInt — ID in the global moneda catalog
  st: number;             // 0 = inactive, 1 = active
  created_at: string | null;
  updated_at: string | null;
  descripcion: string;    // e.g. "Soles", "Dólares Americanos"
  sigla: string;          // e.g. "PEN", "USD"
  sigla_sunat: string;    // SUNAT code, e.g. "PEN", "USD"
}

/** Active currencies (GET /currency/st_currency) add a redundant `moneda` field. */
export interface ActiveCurrencyEntry extends CurrencyEntry {
  moneda: string;         // id_moneda from the moneda table (redundant with id_moneda)
}

/** Response of PATCH /currency/:id. Note: `messa` is the literal (misspelled) backend field. */
export interface ToggleCurrencyResponse {
  messa: string;          // e.g. "St Actualizado"
  data: CurrencyEntry;    // partial at runtime — only `st` is guaranteed present
}
