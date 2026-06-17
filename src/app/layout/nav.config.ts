export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', icon: 'pi-th-large', route: '/sales' },
    ],
  },
  {
    label: 'Organización',
    items: [
      { label: 'Empresa y Sucursal', icon: 'pi-building',  route: '/company-branch', badge: 3 },
      { label: 'Usuarios',           icon: 'pi-user-plus', route: '/user-registration', badge: 2 },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { label: 'Productos',            icon: 'pi-box',           route: '/products' },
      { label: 'Punto de Venta',       icon: 'pi-shopping-cart', route: '/pos' },
      { label: 'Historial de Ventas',  icon: 'pi-history',       route: '/sale-list' },
      { label: 'Compras',              icon: 'pi-tag',           route: '/purchases' },
      { label: 'Cotizaciones',         icon: 'pi-file',          route: '/quotations', badge: 2 },
      { label: 'Clientes y Proveedores', icon: 'pi-users',       route: '/customers-suppliers' },
      { label: 'Unidades de Medida',   icon: 'pi-sliders-h',     route: '/unit-measures' },
    ],
  },
  {
    label: 'Análisis',
    items: [
      { label: 'Reportes',      icon: 'pi-chart-bar', route: '/reports' },
      { label: 'Configuración', icon: 'pi-cog',       route: '/settings' },
    ],
  },
];
