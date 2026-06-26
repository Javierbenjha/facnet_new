import { CompanySummary } from './company.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  nombre: string;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;
  email: string;
  telefono?: string | null;
  imagen_url?: string | null;
  role: number;
  ciaId?: string;
  sucursalId?: string;
}

export interface LoginResponse {
  user: User;
  activeCompany: CompanySummary | null;
  companies: CompanySummary[];
  sucursalId: string | null;
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
  permissions?: Record<string, string>
}

// PATCH /auth/profile — all fields optional, only sent ones are updated.
export interface UpdateProfileRequest {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  email?: string;
  telefono?: string;
}

// PATCH /auth/profile returns the updated user (subset of fields).
export interface UpdateProfileResponse {
  id: string;
  nombre: string;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;
  email: string;
  telefono?: string | null;
  imagen_url?: string | null;
  role: number;
}
