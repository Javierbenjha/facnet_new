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
      { label: 'Dashboard', icon: 'pi-th-large', route: '/dashboard' },
    ],
  },
  {
    label: 'Organización',
    items: [
      { label: 'Empresas',   icon: 'pi-building', route: '/empresas',   badge: 3 },
      { label: 'Sucursales', icon: 'pi-map-marker', route: '/sucursales', badge: 8 },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { label: 'Productos',              icon: 'pi-box',           route: '/productos' },
      { label: 'Punto de venta',         icon: 'pi-shopping-cart', route: '/ventas' },
      { label: 'Historial de ventas',    icon: 'pi-history',       route: '/historial' },
      { label: 'Compras',                icon: 'pi-tag',           route: '/compras' },
      { label: 'Cotizaciones',           icon: 'pi-file',          route: '/cotizaciones', badge: 2 },
      { label: 'Clientes y proveedores', icon: 'pi-users',         route: '/clientes' },
    ],
  },
  {
    label: 'Análisis',
    items: [
      { label: 'Reportes',      icon: 'pi-chart-bar', route: '/reportes' },
      { label: 'Configuración', icon: 'pi-cog',       route: '/configuracion' },
    ],
  },
];
