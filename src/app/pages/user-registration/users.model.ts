// Un par sucursal+rol asignado a un sub-usuario.
export interface Assignment {
  sucursalId: string;
  sucursal: string; // descripción de la sucursal
  roleId: string;
  role: string; // slug del rol
}

// Fila de la lista paginada (GET /user).
export interface UserListItem {
  id: string;
  nombre: string;
  email: string;
  estado: number; // 1 = activo, 2 = inactivo
  imagen: string | null; // URL completa, lista para <img src="...">
  roles: Assignment[];
}

// Detalle completo (GET /user/:id).
export interface UserDetail {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  telefono: string | null;
  imagen: string | null;
  role: number; // 2 = sub-usuario
  estado: number; // 1 = activo, 2 = inactivo
  assignments: Assignment[];
}

// Conteos de la empresa activa (GET /user/stats).
export interface UserStats {
  total: number;
  activos: number;
  inactivos: number;
}

// Respuesta paginada de GET /user.
export interface UserListResponse {
  data: UserListItem[];
  total: number;
  page: number;
  limit: number;
}

// Query params de GET /user. `search` queda listo para cuando el backend lo despache.
export interface UserListParams {
  ciaId?: string;
  sucursalId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Par mínimo que el form serializa hacia el backend.
export interface AssignmentInput {
  sucursalId: string;
  roleId: string;
}

// Payload de POST /user — se envía SIEMPRE como multipart/form-data.
export interface CreateUserPayload {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string; // mínimo 6 caracteres
  telefono?: string;
  ciaId: string;
  assignments: AssignmentInput[]; // se serializa a string JSON dentro del servicio
  imagen?: File;
}

// Payload de PUT /user/:id — multipart/form-data, todo opcional.
export interface UpdateUserPayload {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  password?: string;
  imagen?: File;
}

// Payload de PUT /user/:id/assignments — JSON normal (sin archivos).
export interface UpdateAssignmentsPayload {
  ciaId: string;
  assignments: AssignmentInput[];
}

// Respuesta de las operaciones de toggle (DELETE /user/:id).
export interface ToggleUserResponse {
  message: string;
  user: UserDetail;
}
