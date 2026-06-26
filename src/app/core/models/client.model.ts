export interface ClientSupplier {
  numero_documento: string;
  cia_id_cia: string;
  documento_id_documento: string;
  documento_descripcion: string | null;
  tipo_persona: number;
  display_name: string;
  razon_social: string | null;
  nombre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  ubigeo: string | null;
  departamento_nombre: string | null;
  provincia_nombre: string | null;
  distrito_nombre: string | null;
  telefono: string | null;
  email: string | null;
  observaciones: string | null;
  retenedor: number;
  estado: number;
  fecha_adi: string | null;
  fecha_mod: string | null;
}

export interface ClientAddress {
  id: string | null;
  source: 'primary' | 'secondary';
  descripcion: string;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  ubigeo: string | null;
  departamento_nombre: string | null;
  provincia_nombre: string | null;
  distrito_nombre: string | null;
  cliente_id_cliente?: string;
  cia_id_cia?: string;
  estado: number;
  fecha_adi?: string | null;
  fecha_mod?: string | null;
}

export interface CreateClientPayload {
  numero_documento: string;
  documento_id_documento: string;
  tipo_persona: number;
  razon_social?: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  telefono?: string;
  email?: string;
  observaciones?: string;
  retenedor?: number;
}

export type UpdateClientPayload = Partial<
  Omit<CreateClientPayload, 'numero_documento' | 'tipo_persona'>
>;

export interface CreateClientAddressPayload {
  descripcion: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export type UpdateClientAddressPayload = Partial<CreateClientAddressPayload>;

export interface ExpressClientPayload {
  numero_documento: string;
  tipo_persona: number;
}

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  newToday: number;
}

export interface DocumentType {
  id_documento: string;
  descripcion: string;
  sigla: string;
}

export interface DocumentTypeWithStatus extends DocumentType {
  st: number;
}

export interface ToggleDocumentTypeResponse {
  message: string;
  document_type: DocumentTypeWithStatus;
}

export interface ClientListResponse {
  data: ClientSupplier[];
  total: number;
  page: number;
  limit: number;
}
