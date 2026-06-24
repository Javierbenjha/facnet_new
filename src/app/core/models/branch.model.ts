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
  meta: number;             // meta de ventas mensual de la sucursal
  telefono?: string;
  email?: string;
}

// Shape enriquecido de GET /cia/all-branches y GET /cia/branches/:id.
// Trae la empresa (ciaId/ciaNombre/color), los códigos de ubigeo (para precargar selects)
// y sus nombres legibles (para mostrar). No trae estadoDescripcion.
export interface SucursalListItem {
  id: string;
  ciaId: string;
  ciaNombre: string;
  color: string | null;
  descripcion: string;
  direccion: string;
  codigoDepartamento: string;
  departamento: string;
  codigoProvincia: string;
  provincia: string;
  codigoDistrito: string;
  distrito: string;
  ubigeo: string;
  meta: number;
  telefono: string | null;
  email: string | null;
  estado: number;
}

