export interface Empresa {
  id: string;
  ruc: string;
  razon_social: string;
  direccion: string;
  ubigeo: string;
  usuario_sol: string;
  clave_sol: string;
  ctedetra: string;
  client_id: string;
  client_secret: string;
  monto700: number;
  limite_retencion: number;
  monto_mensual: number;
  monto_anual: number;
  stdetraccion: boolean;
  stretencion: boolean;
  logo_vertical?: string;
  logo_horizontal?: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface Sucursal {
  id: string;
  empresa_id: string;
  empresa_nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  meta: number;
  departamento: string;
  provincia: string;
  distrito: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export const EMPRESAS_MOCK: Empresa[] = [
  {
    id: '1',
    ruc: '20123456789',
    razon_social: 'HARD SYSTEM PERU S.A.C.',
    direccion: 'Av. Abancay 491, Lima',
    ubigeo: '150101',
    usuario_sol: 'HSPPERU',
    clave_sol: 'sol123',
    ctedetra: '00-123456',
    client_id: 'cli_001',
    client_secret: 'sec_abc',
    monto700: 700,
    limite_retencion: 1400,
    monto_mensual: 50000,
    monto_anual: 600000,
    stdetraccion: true,
    stretencion: false,
    estado: 'ACTIVO',
  },
];

export const SUCURSALES_MOCK: Sucursal[] = [
  {
    id: '1',
    empresa_id: '1',
    empresa_nombre: 'HARD SYSTEM PERU S.A.C.',
    descripcion: 'Sucursal Principal',
    direccion: 'Av. Abancay 491, Lima',
    telefono: '01-4234567',
    email: 'principal@hardsystem.pe',
    meta: 50000,
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'Cercado de Lima',
    estado: 'ACTIVO',
  },
  {
    id: '2',
    empresa_id: '1',
    empresa_nombre: 'HARD SYSTEM PERU S.A.C.',
    descripcion: 'Sucursal San Isidro',
    direccion: 'Av. Rivera Navarrete 765, San Isidro',
    telefono: '01-4216789',
    email: 'sanisidro@hardsystem.pe',
    meta: 80000,
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'San Isidro',
    estado: 'ACTIVO',
  },
];
