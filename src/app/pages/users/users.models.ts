export type Rol = 'Admin' | 'Vendedor' | 'Cajero';

export interface User {
  id:            string;
  nombre:        string;
  email:         string;
  rol:           Rol;
  sucursal:      string;
  estado:        'ACTIVO' | 'INACTIVO';
  ultimo_acceso: string;
}

export const ROLES: Rol[] = ['Admin', 'Vendedor', 'Cajero'];

export const SUCURSALES = ['Todas', 'Miraflores', 'San Isidro', 'Arequipa Centro'];

export const USERS: User[] = [
  { id: 'u01', nombre: 'Ana Quispe',        email: 'ana.quispe@facnet.pe',      rol: 'Admin',    sucursal: 'Miraflores',      estado: 'ACTIVO',   ultimo_acceso: '2026-06-16 09:12' },
  { id: 'u02', nombre: 'Luis Ramírez',      email: 'luis.ramirez@facnet.pe',    rol: 'Vendedor', sucursal: 'Miraflores',      estado: 'ACTIVO',   ultimo_acceso: '2026-06-16 08:47' },
  { id: 'u03', nombre: 'María Torres',      email: 'maria.torres@facnet.pe',    rol: 'Cajero',   sucursal: 'San Isidro',      estado: 'ACTIVO',   ultimo_acceso: '2026-06-15 19:30' },
  { id: 'u04', nombre: 'Carlos Mendoza',    email: 'carlos.mendoza@facnet.pe',  rol: 'Vendedor', sucursal: 'San Isidro',      estado: 'INACTIVO', ultimo_acceso: '2026-05-28 14:05' },
  { id: 'u05', nombre: 'Rosa Flores',       email: 'rosa.flores@facnet.pe',     rol: 'Cajero',   sucursal: 'Arequipa Centro', estado: 'ACTIVO',   ultimo_acceso: '2026-06-16 07:58' },
  { id: 'u06', nombre: 'Jorge Salazar',     email: 'jorge.salazar@facnet.pe',   rol: 'Vendedor', sucursal: 'Arequipa Centro', estado: 'ACTIVO',   ultimo_acceso: '2026-06-14 11:20' },
  { id: 'u07', nombre: 'Elena Castro',      email: 'elena.castro@facnet.pe',    rol: 'Admin',    sucursal: 'San Isidro',      estado: 'ACTIVO',   ultimo_acceso: '2026-06-16 10:03' },
  { id: 'u08', nombre: 'Pedro Núñez',       email: 'pedro.nunez@facnet.pe',     rol: 'Cajero',   sucursal: 'Miraflores',      estado: 'INACTIVO', ultimo_acceso: '2026-04-30 16:42' },
  { id: 'u09', nombre: 'Sofía Vargas',      email: 'sofia.vargas@facnet.pe',    rol: 'Vendedor', sucursal: 'Miraflores',      estado: 'ACTIVO',   ultimo_acceso: '2026-06-15 18:11' },
  { id: 'u10', nombre: 'Diego Rojas',       email: 'diego.rojas@facnet.pe',     rol: 'Vendedor', sucursal: 'Arequipa Centro', estado: 'ACTIVO',   ultimo_acceso: '2026-06-16 09:55' },
  { id: 'u11', nombre: 'Carmen Díaz',       email: 'carmen.diaz@facnet.pe',     rol: 'Cajero',   sucursal: 'San Isidro',      estado: 'ACTIVO',   ultimo_acceso: '2026-06-13 12:34' },
  { id: 'u12', nombre: 'Andrés Paredes',    email: 'andres.paredes@facnet.pe',  rol: 'Admin',    sucursal: 'Miraflores',      estado: 'INACTIVO', ultimo_acceso: '2026-03-19 09:00' },
];
