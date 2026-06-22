import { CompanySummary } from './company.model';

export interface LoginRequest {
  email: string;
  password: string;
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
  activeCompany: CompanySummary;
  companies: CompanySummary[];
  sucursalId: string;
}

export interface MeResponse {
  user: User;
  activeCompany: CompanySummary | null;
  companies: CompanySummary[];
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
  companies: CompanySummary[];
  activeCompany: null;
  sucursalId: null;
}

export interface SessionResponse {
  user: User;
  activeCompany: CompanySummary | null;
  companies?: CompanySummary[];
  sucursalId?: string | null;
  permissions?: Record<string, string>;
}
