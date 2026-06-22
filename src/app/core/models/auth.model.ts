export interface LoginRequest {
  email: string;
  password: string;
}

export interface Company {
  id: string;
  descripcion: string;
  ruc: string;
}

export interface User {
  id: string;
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  email: string;
  role: number;
  ciaId?: string;
  sucursalId?: string;
}

export interface LoginResponse {
  user: User;
  activeCompany: Company;
  companies: Company[];
  sucursalId: string;
}

export interface MeResponse {
  user: User;
  roles: string[];
  permissions: Record<string, string>;
}

export interface RegisterRequest {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string;
  telefono: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  companies: Company[];
  activeCompany: null;
  sucursalId: null;
}

export interface SessionResponse{
  user: User;
  activeCompany: ActiveCompany | null;
}


export interface ActiveCompany {
  id: string;
  descripcion: string;
  ruc: string;
}
