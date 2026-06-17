export interface Modulo {
  id: string;
  code: string;
  label: string;
  icon: string;
  route: string;
  order: number;
  actions: string[];
  canExport: boolean;
}
