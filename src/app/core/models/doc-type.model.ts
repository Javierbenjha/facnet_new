export interface CompanyDocType {
  id: string;
  tipo_doc: number;
  descripcion: string | null;
  sigla: string | null;
  st_venta: number;
  st_compra: number;
}

export interface ToggleDocTypeResponse {
  message: string;
  doc_type: CompanyDocType;
}
