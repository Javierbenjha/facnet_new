import { ClientAddress, ClientSupplier } from '../../core/models/client.model';

export type TipoDocumento = 'DNI' | 'RUC' | 'CE';
export type TipoPersona  = 'CLIENTE' | 'PROVEEDOR';

export interface Direccion {
  id:           string | null;
  source:       'primary' | 'secondary';
  descripcion:  string;
  departamento: string | null;  // ubigeo code — used by form selects
  provincia:    string | null;  // ubigeo code
  distrito:     string | null;  // ubigeo code
  dep_nombre:   string | null;  // human-readable name for display
  prov_nombre:  string | null;
  dist_nombre:  string | null;
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
  _raw:             ClientSupplier;
}

export function mapClientToPersona(c: ClientSupplier): Persona {
  const sigla = (c.documento_descripcion ?? '').toUpperCase();
  const tipoDoc: TipoDocumento = sigla.includes('RUC') ? 'RUC' : (sigla.includes('EXTRANJERIA') || sigla === 'CE' ? 'CE' : 'DNI');
  return {
    id:               c.numero_documento,
    tipo:             c.tipo_persona === 2 ? 'PROVEEDOR' : 'CLIENTE',
    tipo_documento:   tipoDoc,
    numero_documento: c.numero_documento,
    nombre:           c.display_name,
    apellido_paterno: c.apellido_paterno ?? undefined,
    apellido_materno: c.apellido_materno ?? undefined,
    telefono:         c.telefono ?? '',
    email:            c.email ?? '',
    direccion:        c.direccion ?? '',
    departamento:     c.departamento_nombre ?? c.departamento ?? '',
    provincia:        c.provincia_nombre ?? c.provincia ?? '',
    distrito:         c.distrito_nombre ?? c.distrito ?? '',
    estado:           c.estado === 1 ? 'ACTIVO' : 'INACTIVO',
    _raw:             c,
  };
}

export function mapAddressToDireccion(a: ClientAddress): Direccion {
  return {
    id:           a.id,
    source:       a.source,
    descripcion:  a.descripcion,
    departamento: a.departamento,
    provincia:    a.provincia,
    distrito:     a.distrito,
    dep_nombre:   a.departamento_nombre ?? a.departamento,
    prov_nombre:  a.provincia_nombre ?? a.provincia,
    dist_nombre:  a.distrito_nombre ?? a.distrito,
    es_principal: a.source === 'primary',
  };
}
