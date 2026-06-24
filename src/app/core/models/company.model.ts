export interface CompanySummary {
  id: string;
  descripcion: string;
  ruc: string;
}


export interface Cia {
  id:                string;
  descripcion:       string;
  ruc:               string;
  direccion:         string;
  ubigeo:            string;
  usuario_sol:       string;
  clave_sol:         string;
  c_igv:             number;
  monto700:          string;
  monto_mensual:     string;
  monto_anual:       string;
  stPassword:        number;
  stdetraccion:      number;
  stretencion:       number;
  ctedetra:          string;
  limit_ret:         string;
  client_id:         string | null;
  logoVertical:      string | null;
  logoHorizontal:    string | null;
  estado:            number;
  estadoDescripcion: string | null;
  created_at:        Date;
  updated_at:        Date;
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
  usuario_id?: string;      // Lo resuelve el backend desde el token; no hace falta mandarlo
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


export interface CiaIGVResponse{
  message: string;
  company: Cia
}

export interface CiaIGV{
  c_igv: number;
}

export type CiaPasswordResponse = CiaIGVResponse;

export interface CiaPassword{
  password: string
}