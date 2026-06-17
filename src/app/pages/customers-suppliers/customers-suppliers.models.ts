export type TipoDocumento = 'DNI' | 'RUC' | 'CE';
export type TipoPersona  = 'CLIENTE' | 'PROVEEDOR';

export interface Direccion {
  id:           string;
  descripcion:  string;
  departamento: string;
  provincia:    string;
  distrito:     string;
  es_principal: boolean;
}

export interface Persona {
  id:               string;
  tipo:             TipoPersona;
  tipo_documento:   TipoDocumento;
  numero_documento: string;
  nombre:           string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono:         string;
  email:            string;
  direccion:        string;
  departamento:     string;
  provincia:        string;
  distrito:         string;
  estado:           'ACTIVO' | 'INACTIVO';
  direcciones?:     Direccion[];
}

export const PERSONAS_MOCK: Persona[] = [
  {
    id: '1', tipo: 'CLIENTE', tipo_documento: 'DNI', numero_documento: '76329484',
    nombre: 'Juan Carlos', apellido_paterno: 'García', apellido_materno: 'López',
    telefono: '987654321', email: 'juan.garcia@gmail.com',
    direccion: 'Av. Los Incas 123', departamento: 'Lima', provincia: 'Lima', distrito: 'Miraflores',
    estado: 'ACTIVO',
    direcciones: [
      { id: 'd1-1', descripcion: 'Av. Los Incas 123', departamento: 'Lima', provincia: 'Lima', distrito: 'Miraflores', es_principal: true },
      { id: 'd1-2', descripcion: 'Jr. Las Flores 456, Dpto. 302', departamento: 'Lima', provincia: 'Lima', distrito: 'San Borja', es_principal: false },
    ],
  },
  {
    id: '2', tipo: 'CLIENTE', tipo_documento: 'RUC', numero_documento: '20749652321',
    nombre: 'COMERCIAL LOS ANDES S.A.C.',
    telefono: '01-4234567', email: 'ventas@losandes.pe',
    direccion: 'Jr. Ucayali 456', departamento: 'Lima', provincia: 'Lima', distrito: 'Cercado de Lima',
    estado: 'ACTIVO',
    direcciones: [
      { id: 'd2-1', descripcion: 'Jr. Ucayali 456 - Oficina principal', departamento: 'Lima', provincia: 'Lima', distrito: 'Cercado de Lima', es_principal: true },
      { id: 'd2-2', descripcion: 'Av. Colonial 1800 - Almacén', departamento: 'Lima', provincia: 'Lima', distrito: 'Breña', es_principal: false },
      { id: 'd2-3', descripcion: 'Parque Industrial Ate s/n', departamento: 'Lima', provincia: 'Lima', distrito: 'Ate', es_principal: false },
    ],
  },
  {
    id: '3', tipo: 'CLIENTE', tipo_documento: 'DNI', numero_documento: '45123678',
    nombre: 'María', apellido_paterno: 'Rodríguez', apellido_materno: 'Vega',
    telefono: '999123456', email: 'maria.rodriguez@hotmail.com',
    direccion: 'Calle Los Pinos 789', departamento: 'Lima', provincia: 'Lima', distrito: 'San Isidro',
    estado: 'INACTIVO',
  },
  {
    id: '4', tipo: 'CLIENTE', tipo_documento: 'CE', numero_documento: 'CE-000123456',
    nombre: 'Carlos', apellido_paterno: 'Martínez',
    telefono: '998765432', email: 'cmartinez@empresa.com',
    direccion: 'Av. Arequipa 1200', departamento: 'Lima', provincia: 'Lima', distrito: 'Lince',
    estado: 'ACTIVO',
  },
  {
    id: '5', tipo: 'PROVEEDOR', tipo_documento: 'RUC', numero_documento: '20123456789',
    nombre: 'IMPORTACIONES DEL NORTE S.R.L.',
    telefono: '01-6543210', email: 'contacto@impnorte.pe',
    direccion: 'Av. Industrial 1200', departamento: 'Lima', provincia: 'Lima', distrito: 'Ate',
    estado: 'ACTIVO',
  },
  {
    id: '6', tipo: 'PROVEEDOR', tipo_documento: 'RUC', numero_documento: '20987654321',
    nombre: 'TECH SUPPLIES PERU E.I.R.L.',
    telefono: '01-3456789', email: 'ventas@techsupplies.pe',
    direccion: 'Jr. Camaná 567', departamento: 'Lima', provincia: 'Lima', distrito: 'Cercado de Lima',
    estado: 'ACTIVO',
  },
  {
    id: '7', tipo: 'PROVEEDOR', tipo_documento: 'RUC', numero_documento: '20555444333',
    nombre: 'DISTRIBUIDORA CENTRAL S.A.',
    telefono: '01-7891234', email: 'info@distcentral.pe',
    direccion: 'Av. Venezuela 890', departamento: 'Lima', provincia: 'Lima', distrito: 'Breña',
    estado: 'INACTIVO',
  },
];
