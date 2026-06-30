export interface TipoDocFiltroOption {
  value: number;
  label: string;
}

export const TIPO_DOC_OPCIONES: TipoDocFiltroOption[] = [
  { value: 0,  label: 'Todos' },
  { value: 1,  label: 'Factura' },
  { value: 3,  label: 'Boleta' },
  { value: 7,  label: 'Nota de Crédito' },
  { value: 8,  label: 'Nota de Débito' },
  { value: 41, label: 'Doc. Interno' },
];
