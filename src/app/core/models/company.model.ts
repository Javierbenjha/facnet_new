export interface CompanySummary {
  id: string;
  descripcion: string;
  ruc: string;
}

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

export interface CompanyRequest {
  ruc: string;              // Requerido, exactamente 11 dígitos
  descripcion: string;      // Requerido - Razón social
  direccion: string;        // Requerido - Dirección fiscal
  ubigeo: string;           // Requerido - Código de ubigeo
  usuario_sol: string;     // Opcional - Usuario SOL de SUNAT
  clave_sol: string;       // Opcional - Clave SOL de SUNAT
  logo_vertical?: File;     // Opcional - JPG
  logo_horizontal?: File;   // Opcional - JPG
  monto700: number;         // Requerido, mín. 0 (default: 700)
  monto_mensual: number;    // Requerido, mín. 0 (default: 0)
  monto_anual: number;      // Requerido, mín. 0 (default: 0)
  stdetraccion: number;    // Default: false - ¿Aplica detracción?
  stretencion: number;     // Default: false - ¿Aplica retención?
  limit_ret: number;        // Requerido, mín. 0 (default: 700)
  ctedetra: string;        // Opcional - Cuenta de detracción
  usuario_id: string;       // Requerido - ID del usuario (del JWT)
}

export interface CompanyResponse {
  user: {
    id: string;
    nombre: string;
    email: string;
    role: number;
  };
  activeCompany: CompanySummary;
  sucursalId: null;
  company: Cia;
}
