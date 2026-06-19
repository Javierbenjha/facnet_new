export interface Cia {
  id: string;
  descripcion: string;
  ruc: string;
  direccion: string;
  ubigeo: string;
  c_igv: number;
  stPassword: number;
  logoVertical: string | null;
  logoHorizontal: string | null;
  estado: number;
  estadoDescripcion: string | null;
}

export interface CreateCompanyPayload {
  descripcion: string;
  ruc: string; // 11 dígitos
  direccion: string;
  ubigeo: string;
  usuario_sol?: string;
  clave_sol?: string;
  c_igv?: number;
  monto700?: number;
  monto_mensual?: number;
  monto_anual?: number;
  st_password?: number;
  stdetraccion?: number;
  stretencion?: number;
  ctedetra?: string;
  limit_ret?: number;
  client_id?: string;
  client_secret?: string;
}

export interface CreateSucursalPayload {
  descripcion: string;
  departamento: string; // 2 dígitos (ubigeo)
  provincia: string; // 2 dígitos
  distrito: string; // 2 dígitos
  ubigeo: string; // 6 dígitos
  direccion: string;
  telefono?: string;
  email?: string;
}

export interface CompanyRequest {
  descripcion: string;
  ruc: string;
  direccion: string;
  ubigeo: string;
}

export interface CompanyResponse {
  user: {
    id: string;
    nombre: string;
    email: string;
    role: number;
  };
  activeCompany: { id: string; descripcion: string; ruc: string };
  sucursalId: null;
  company: Cia;
}
