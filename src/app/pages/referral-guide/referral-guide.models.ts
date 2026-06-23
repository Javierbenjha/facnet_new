export type EstadoGuia          = 'ACTIVO' | 'ANULADO';
export type EstadoSunat         = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'NO_ENVIADO';
export type ModalidadTransporte = 'PUBLICO' | 'PRIVADO';

export interface DetalleGuia {
  id: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  peso: number;
}

export interface GuiaRemision {
  id: string;
  serie: string;
  correlativo: string;
  fecha: string;
  fecha_traslado: string;
  motivo: string;
  descripcion?: string;
  cliente: string;
  ruc_cliente?: string;
  destino_direccion: string;
  partida_direccion: string;
  modalidad: ModalidadTransporte;
  empresa_transporte?: string;
  ruc_transporte?: string;
  conductor?: string;
  dni_conductor?: string;
  placa?: string;
  peso_total: number;
  numero_orden_compra?: string;
  doc_ref_tipo?: string;
  doc_ref_serie?: string;
  doc_ref_correlativo?: string;
  estado: EstadoGuia;
  estado_sunat: EstadoSunat;
  detalles: DetalleGuia[];
}

export const MOTIVOS_GUIA: string[] = [
  'VENTA',
  'COMPRA',
  'TRASLADO ENTRE ESTABLECIMIENTOS',
  'EXPORTACION',
  'OTROS',
];

export const TIPOS_DOC_REF: string[] = [
  'FACTURA', 'BOLETA', 'ORDEN DE COMPRA', 'GUIA DE REMISION',
];

export const GUIAS_MOCK: GuiaRemision[] = [
  {
    id: '1', serie: 'T001', correlativo: '00000012',
    fecha: '2026-06-22', fecha_traslado: '2026-06-23',
    motivo: 'VENTA', cliente: 'Empresa ABC SAC', ruc_cliente: '20123456789',
    destino_direccion: 'Av. Los Olivos 123, Lima',
    partida_direccion: 'Jr. Comercio 456, Lima',
    modalidad: 'PUBLICO', empresa_transporte: 'Transportes Lima SAC',
    ruc_transporte: '20987654321', placa: 'ABC-123', peso_total: 150.5,
    doc_ref_tipo: 'FACTURA', doc_ref_serie: 'F001', doc_ref_correlativo: '00000045',
    estado: 'ACTIVO', estado_sunat: 'ACEPTADO',
    detalles: [
      { id: '1', codigo: 'PROD-001', descripcion: 'Laptop Dell 15"', cantidad: 2, peso: 4.5 },
      { id: '2', codigo: 'PROD-002', descripcion: 'Monitor 27"',     cantidad: 3, peso: 6.0 },
    ],
  },
  {
    id: '2', serie: 'T001', correlativo: '00000011',
    fecha: '2026-06-21', fecha_traslado: '2026-06-21',
    motivo: 'COMPRA', cliente: 'Tech Import SAC', ruc_cliente: '20456789123',
    destino_direccion: 'Av. Industrial 789, Lima',
    partida_direccion: 'Parque Industrial Norte 45, Lima',
    modalidad: 'PRIVADO', conductor: 'Juan Pérez García', dni_conductor: '45678912',
    placa: 'XYZ-456', peso_total: 250.0,
    estado: 'ACTIVO', estado_sunat: 'PENDIENTE',
    detalles: [
      { id: '1', codigo: 'PROD-010', descripcion: 'Cajas de papel A4', cantidad: 10, peso: 25.0 },
    ],
  },
  {
    id: '3', serie: 'T001', correlativo: '00000010',
    fecha: '2026-06-20', fecha_traslado: '2026-06-20',
    motivo: 'TRASLADO ENTRE ESTABLECIMIENTOS', cliente: '— Traslado interno —',
    destino_direccion: 'Sucursal Miraflores, Av. Larco 300',
    partida_direccion: 'Almacén Central, Av. Argentina 100',
    modalidad: 'PRIVADO', conductor: 'Carlos Mamani', dni_conductor: '30123456',
    placa: 'DEF-789', peso_total: 80.0,
    estado: 'ACTIVO', estado_sunat: 'PENDIENTE',
    detalles: [
      { id: '1', codigo: 'PROD-005', descripcion: 'Sillas ergonómicas', cantidad: 5, peso: 16.0 },
    ],
  },
  {
    id: '4', serie: 'T001', correlativo: '00000009',
    fecha: '2026-06-18', fecha_traslado: '2026-06-19',
    motivo: 'VENTA', cliente: 'Comercial XYZ EIRL', ruc_cliente: '20654321098',
    destino_direccion: 'Calle Los Pinos 55, Surco',
    partida_direccion: 'Jr. Comercio 456, Lima',
    modalidad: 'PUBLICO', empresa_transporte: 'Rappi Cargo SAC',
    ruc_transporte: '20111222333', placa: 'GHI-012', peso_total: 45.0,
    doc_ref_tipo: 'BOLETA', doc_ref_serie: 'B001', doc_ref_correlativo: '00000089',
    estado: 'ANULADO', estado_sunat: 'RECHAZADO',
    detalles: [
      { id: '1', codigo: 'PROD-003', descripcion: 'Mouse inalámbrico', cantidad: 20, peso: 2.0 },
      { id: '2', codigo: 'PROD-004', descripcion: 'Teclado mecánico',  cantidad: 10, peso: 4.5 },
    ],
  },
  {
    id: '5', serie: 'T001', correlativo: '00000008',
    fecha: '2026-06-15', fecha_traslado: '2026-06-16',
    motivo: 'EXPORTACION', cliente: 'Global Tech Corp',
    destino_direccion: 'Puerto del Callao, Muelle 12',
    partida_direccion: 'Zona Franca Industrial, Lima',
    modalidad: 'PUBLICO', empresa_transporte: 'Exporta Perú SAC',
    ruc_transporte: '20444555666', placa: 'JKL-345', peso_total: 500.0,
    estado: 'ACTIVO', estado_sunat: 'NO_ENVIADO',
    detalles: [
      { id: '1', codigo: 'PROD-099', descripcion: 'Artesanías textiles', cantidad: 200, peso: 2.5 },
    ],
  },
];
