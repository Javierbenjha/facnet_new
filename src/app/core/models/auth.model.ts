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
  email: string;
  role: number;
}

export interface LoginResponse {
  user: User;
  activeCompany: Company;
  companies: Company[];
  sucursalId: string;
}