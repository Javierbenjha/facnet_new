export interface SaleDocType {
  id: number;
  descripcion: string | null;
  sigla: string | null;
}

export interface SalePaymentMethod {
  id: string;
  descripcion: string;
  sigla_pago: string;
}

export interface SaleItem {
  id: string;
  producto_id: string;
  producto: string | null;
  cantidad: string;
  precio_lista: string;
  precio_venta: string;
  descuento: string;
  neto: string;
  costo: string;
  st_afecto: number | null;
}

export interface SaleCollection {
  id: string;
  fecha: string;
  id_pago: string;
  pagoDescripcion: string | null;
  moneda: string;
  monedaDescripcion: string | null;
  importe: string;
  tipo_cambio: string | null;
  vuelto: string | null;
  nroperacion: string | null;
  banco_id_banco: string | null;
  billetera_id: string | null;
  estado: number;
}

export interface SaleCuota {
  correl: number;
  impcuota: string;
  fecvencuota: string | null;
}

export interface Sale {
  tip_doc: number;
  tipDocDescripcion: string | null;
  serie: string;
  correlativo: string;
  numero: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  moneda: number;
  monedaDescripcion: string | null;
  forma_pago: number;
  formaPagoDescripcion: string | null;
  cliente_numero_documento: string | null;
  clienteNombre: string | null;
  subtotal: string;
  descuento: string;
  pordesc: string;
  igv: string;
  v_igv: number | null;
  total_inafecto: string;
  total: string;
  total_costo: string;
  tipo_cambio: string;
  saldo: string;
  saldo_credito: string;
  coddetrac: number | null;
  pordetrac: string;
  impdetracs: string;
  estado: number;
  estadoDescripcion: 'ACTIVE' | 'CANCELLED' | null;
  estado_sunat: string | null;
  tip_doc_ref: number | null;
  serie_ref: string | null;
  correlativo_ref: string | null;
  motivo_nc: string | null;
  fecha_adi: string | null;
  fecha_mod: string | null;
  items: SaleItem[];
  collections: SaleCollection[];
  cuotas: SaleCuota[];
}

export interface SaleListResponse {
  data: Sale[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface CreateSaleItemPayload {
  producto_id: number;
  cantidad: number;
  precio_lista: number;
  precio_venta: number;
  descuento?: number;
}

export interface CreateSaleCollectionPayload {
  forma_pago_id: number;
  monto: number;
}

export interface CreateSaleCuotaPayload {
  correl: number;
  impcuota: number;
  fecvencuota?: string;
}

export interface CreateSaleHeaderPayload {
  tip_doc: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  moneda: number;
  forma_pago: number;
  tipo_cambio: number;
  cliente_numero_documento?: string;
  v_igv?: number;
  coddetrac?: number;
  pordetrac?: number;
  tip_doc_ref?: number;
  serie_ref?: string;
  correlativo_ref?: string;
  motivo_nc?: string;
  st_stock?: 0 | 1;
}

export interface CreateSalePayload {
  header: CreateSaleHeaderPayload;
  items: CreateSaleItemPayload[];
  collections?: CreateSaleCollectionPayload[];
  cuotas?: CreateSaleCuotaPayload[];
}

export type AddCollectionPayload = CreateSaleCollectionPayload;

export interface CreateSaleResponse extends Sale {
  ticket_url: string;
}

export interface SaleListFilters {
  page?: number;
  limit?: number;
  tip_doc?: number;
  serie?: string;
  correlativo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  cliente?: string;
  estado?: number;
}
