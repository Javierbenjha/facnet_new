export interface TransferMotivo {
  id: string;
  descripcion: string;
  mueve_stock: boolean;
}

export interface ShippingGuideItem {
  id: string;
  producto_id: string;
  descripcion: string;
  cantidad: string;
  peso: string;
}

export interface ShippingGuide {
  serie: string;
  correlativo: string;
  numero: string;
  fecha: string;
  motivo_id: string | null;
  motivoDescripcion: string | null;
  mueve_stock: boolean;
  descripcion: string | null;
  peso_total: string;
  tipo_traslado: 1 | 2;
  tipo_vehiculo: number;
  placa: string | null;
  empresa_transporte_id: string | null;
  transportistaRazonSocial: string | null;
  conductor_id: string | null;
  conductorNombre: string | null;
  sucursal_destino_id: number | null;
  direccion_destino_cliente: number | null;
  direccion_partida_proveedor: number | null;
  cliente_id: string | null;
  proveedor_id: string | null;
  observaciones: string | null;
  documento_referencia: number | null;
  serie_referencia: string | null;
  correlativo_referencia: string | null;
  fecha_referencia: string | null;
  numero_orden_compra: string | null;
  estado: number;
  estadoDescripcion: 'ACTIVE' | 'CANCELLED' | null;
  estado_sunat: string | null;
  fecha_adi: string | null;
  fecha_mod: string | null;
  items: ShippingGuideItem[];
}

export interface ShippingGuideListResponse {
  data: ShippingGuide[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface CreateShippingGuideItemPayload {
  producto_id: number;
  descripcion: string;
  cantidad: number;
  peso: number;
}

export interface CreateShippingGuidePayload {
  tip_doc: number;
  fecha: string;
  motivo_id: number;
  peso_total: number;
  tipo_traslado: 1 | 2;
  tipo_vehiculo: number;
  placa?: string;
  empresa_transporte_id?: number;
  conductor_id?: number;
  sucursal_destino_id?: number;
  direccion_destino_cliente?: number;
  direccion_partida_proveedor?: number;
  cliente_id?: string;
  proveedor_id?: string;
  descripcion?: string;
  observaciones?: string;
  documento_referencia?: number;
  serie_referencia?: string;
  correlativo_referencia?: string;
  fecha_referencia?: string;
  numero_orden_compra?: string;
  items: CreateShippingGuideItemPayload[];
}

export interface ShippingGuideListFilters {
  page?: number;
  limit?: number;
  serie?: string;
  correlativo?: string;
  motivo_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  cliente_id?: string;
  estado?: number;
}
