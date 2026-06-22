export interface Sucursal {
  id: string;
  descripcion: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;
  telefono: string | null;
  email: string | null;
  estado: number;
  estadoDescripcion: string | null;
}

export interface SucursalRequest {
  descripcion: string;
  departamento: string;     // 2 dígitos (ubigeo)
  provincia: string;        // 2 dígitos
  distrito: string;         // 2 dígitos
  ubigeo: string;           // 6 dígitos
  direccion: string;
  telefono?: string;
  email?: string;
}

