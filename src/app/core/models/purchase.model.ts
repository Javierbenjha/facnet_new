export interface PurchaseDocType {
  id: number;
  descripcion: string | null;
  sigla: string | null;
}

export interface PurchasePaymentMethod {
  id: string;
  descripcion: string;
  sigla_pago: string;
}

export interface PurchaseItem {
  id: string;
  producto_id: string;
  cantidad: string;
  precio_venta: string;
  neto: string;
}

export interface Purchase {
  tip_doc: number;
  tipDocDescripcion: string | null;
  serie: string;
  correlativo: string;
  numero: string;
  fecha_compra: string;
  fecha_vencimiento: string;
  moneda: number;
  monedaDescripcion: string | null;
  id_pago: number;
  pagoDescripcion: string | null;
  tipo_cambio: string;
  proveedor_numero_documento: string | null;
  proveedorNombre: string | null;
  subtotal: string;
  descuento: string;
  igv: string;
  total: string;
  saldo: string;
  c_igv: number;
  serie_referencia: string;
  correlativo_referencia: string;
  tip_doc_nota: number | null;
  serie_nota: string | null;
  correlativo_nota: string | null;
  estado: number;
  estadoDescripcion: 'ACTIVE' | 'CANCELLED' | null;
  fecha_adi: string | null;
  fecha_mod: string | null;
  items: PurchaseItem[];
}

export interface PurchaseListResponse {
  data: Purchase[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface CreatePurchaseItemPayload {
  producto_id: number;
  cantidad: number;
  precio_venta: number;
}

export interface CreatePurchasePayload {
  header: {
    tip_doc: number;
    fecha_compra: string;
    fecha_vencimiento: string;
    moneda: number;
    id_pago: number;
    tipo_cambio: number;
    proveedor_numero_documento?: string;
    descuento?: number;
    importe_pagado?: number;
    v_igv?: number;
    serie_referencia?: string;
    correlativo_referencia?: string;
    tip_doc_nota?: number;
    serie_nota?: string;
    correlativo_nota?: string;
  };
  items: CreatePurchaseItemPayload[];
}

export interface PurchaseListFilters {
  page?: number;
  limit?: number;
  tip_doc?: number;
  serie?: string;
  correlativo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  proveedor?: string;
  estado?: number;
}
